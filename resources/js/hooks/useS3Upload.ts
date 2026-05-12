/**
 * useS3Upload
 *
 * Handles direct-to-S3 browser uploads via Laravel-generated pre-signed PUT URLs.
 * Files never pass through the Laravel server — the browser uploads straight to S3.
 *
 * Flow:
 *   1. POST /upload/presign  →  { url, key }   (Laravel signs the request)
 *   2. PUT  url  (browser uploads the file body directly to S3)
 *   3. Return { key, name, size, type, url } to the caller
 */

import { useState, useCallback } from 'react';
import axios from 'axios';

export interface S3File {
    uid:      string;   // local temp id
    key:      string;   // S3 object key
    name:     string;   // original filename
    size:     number;   // bytes
    type:     string;   // MIME type
    progress: number;   // 0–100
    status:   'uploading' | 'done' | 'error';
    error?:   string;
}

interface UseS3UploadOptions {
    context?: string;          // S3 folder prefix, e.g. "projects"
    onUploaded?: (file: S3File) => void;
}

export function useS3Upload({ context = 'uploads', onUploaded }: UseS3UploadOptions = {}) {
    const [files, setFiles] = useState<S3File[]>([]);

    const updateFile = (uid: string, patch: Partial<S3File>) =>
        setFiles(prev => prev.map(f => f.uid === uid ? { ...f, ...patch } : f));

    const upload = useCallback(async (rawFile: File) => {
        const uid  = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const stub: S3File = {
            uid, key: '', name: rawFile.name, size: rawFile.size,
            type: rawFile.type, progress: 0, status: 'uploading',
        };
        setFiles(prev => [...prev, stub]);

        try {
            // Step 1 — get pre-signed PUT URL from Laravel
            const { data } = await axios.post<{ url: string; key: string }>(
                route('upload.presign'),
                { filename: rawFile.name, mime_type: rawFile.type, context },
            );

            // Step 2 — upload directly to S3 with progress tracking
            await axios.put(data.url, rawFile, {
                headers: { 'Content-Type': rawFile.type },
                onUploadProgress: (evt) => {
                    const pct = Math.round((evt.loaded / (evt.total ?? 1)) * 100);
                    updateFile(uid, { progress: pct });
                },
            });

            const done: S3File = { ...stub, key: data.key, progress: 100, status: 'done' };
            updateFile(uid, { key: data.key, progress: 100, status: 'done' });
            onUploaded?.(done);
        } catch (err: any) {
            updateFile(uid, {
                status: 'error',
                error: err?.response?.data?.message ?? 'Upload failed',
            });
        }
    }, [context, onUploaded]);

    const uploadMany = useCallback((rawFiles: FileList | File[]) => {
        Array.from(rawFiles).forEach(f => upload(f));
    }, [upload]);

    const remove = useCallback((uid: string) => {
        setFiles(prev => prev.filter(f => f.uid !== uid));
    }, []);

    return { files, upload, uploadMany, remove };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function formatBytes(bytes: number): string {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 ** 2)   return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3)   return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

export function fileIcon(mime: string): string {
    if (mime.startsWith('image/'))       return '🖼️';
    if (mime === 'application/pdf')      return '📄';
    if (mime.includes('word'))           return '📝';
    if (mime.includes('sheet') || mime.includes('excel')) return '📊';
    if (mime.includes('zip') || mime.includes('tar') || mime.includes('rar')) return '🗜️';
    if (mime.startsWith('video/'))       return '🎬';
    if (mime.startsWith('audio/'))       return '🎵';
    return '📁';
}
