<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class S3UploadController extends Controller
{
    /**
     * Generate a pre-signed PUT URL so the browser can upload directly to S3.
     * The file never passes through the Laravel server — the browser POSTs
     * straight to S3 using the signed URL, keeping uploads fast and scalable.
     */
    public function presign(Request $request)
    {
        $request->validate([
            'filename'  => ['required', 'string', 'max:255'],
            'mime_type' => ['required', 'string'],
            'context'   => ['nullable', 'string', 'max:100'], // e.g. "projects", "contracts"
        ]);

        // Build a unique S3 key so files never collide
        $ext     = pathinfo($request->filename, PATHINFO_EXTENSION);
        $context = Str::slug($request->context ?? 'uploads');
        $key     = "{$context}/" . now()->format('Y/m') . '/' . Str::uuid() . '.' . $ext;

        // Generate a presigned PUT URL valid for 15 minutes
        $disk   = Storage::disk('s3');
        $client = $disk->getClient();

        $cmd = $client->getCommand('PutObject', [
            'Bucket'      => config('filesystems.disks.s3.bucket'),
            'Key'         => $key,
            'ContentType' => $request->mime_type,
            'ACL'         => 'private',
        ]);

        $presigned = $client->createPresignedRequest($cmd, '+15 minutes');

        return response()->json([
            'url'          => (string) $presigned->getUri(),
            'key'          => $key,
            'public_url'   => null, // private bucket — access via signed GET URLs
        ]);
    }

    /**
     * Generate a short-lived signed GET URL to stream/download a private file.
     */
    public function signedGet(Request $request)
    {
        $request->validate([
            'key' => ['required', 'string'],
        ]);

        $url = Storage::disk('s3')->temporaryUrl(
            $request->key,
            now()->addMinutes(30)
        );

        return response()->json(['url' => $url]);
    }
}
