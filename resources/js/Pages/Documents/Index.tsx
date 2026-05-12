import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';
import { Download, History, Upload, Search, FolderOpen, FileText, Lock, Shield, Eye, File, Briefcase, User, Heart } from 'lucide-react';
import { useState } from 'react';
import type { PageProps } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Document {
    id: number; name: string; category: string; size: string;
    updated: string; uploader: string; type: string;
    expiresOn?: string; isLocked?: boolean; employeeName: string;
}

// ── All documents (manager sees all; employee sees own) ───────────────────────
const ALL_DOCUMENTS: Document[] = [
    // Sara Kim
    { id: 1,  name: 'Employment_Contract_2024.pdf',    category: 'Contract',    size: '1.2 MB', updated: 'Jan 10, 2024', uploader: 'HR Team',    type: 'pdf', employeeName: 'Sara Kim',      expiresOn: undefined,      isLocked: false },
    { id: 2,  name: 'Offer_Letter_Sara.pdf',           category: 'Offer',       size: '420 KB', updated: 'Dec 5, 2023',  uploader: 'HR Team',    type: 'pdf', employeeName: 'Sara Kim',      expiresOn: undefined,      isLocked: false },
    { id: 3,  name: 'ID_Verification_Sara.pdf',        category: 'Identity',    size: '680 KB', updated: 'Jan 10, 2024', uploader: 'HR Team',    type: 'pdf', employeeName: 'Sara Kim',      expiresOn: 'Dec 31, 2027', isLocked: false },
    { id: 4,  name: 'NDA_Agreement_Sara.pdf',          category: 'Legal',       size: '310 KB', updated: 'Jan 10, 2024', uploader: 'Legal Dept', type: 'pdf', employeeName: 'Sara Kim',      expiresOn: undefined,      isLocked: false },
    { id: 5,  name: 'Health_Insurance_Card.pdf',       category: 'Benefits',    size: '180 KB', updated: 'Feb 1, 2024',  uploader: 'HR Team',    type: 'pdf', employeeName: 'Sara Kim',      expiresOn: 'Dec 31, 2026', isLocked: false },
    { id: 6,  name: 'Tax_Form_W4_2026.pdf',            category: 'Tax',         size: '290 KB', updated: 'Jan 2, 2026',  uploader: 'Payroll',    type: 'pdf', employeeName: 'Sara Kim',      expiresOn: undefined,      isLocked: false },
    { id: 7,  name: 'Performance_Review_2025.pdf',     category: 'Performance', size: '510 KB', updated: 'Dec 20, 2025', uploader: 'Lisa Park',  type: 'pdf', employeeName: 'Sara Kim',      expiresOn: undefined,      isLocked: false },
    { id: 8,  name: 'Salary_Revision_Letter.pdf',      category: 'Compensation',size: '230 KB', updated: 'Apr 1, 2026',  uploader: 'HR Team',    type: 'pdf', employeeName: 'Sara Kim',      expiresOn: undefined,      isLocked: true  },
    // Hamza Ali
    { id: 9,  name: 'Employment_Contract_Hamza.pdf',   category: 'Contract',    size: '1.1 MB', updated: 'Feb 5, 2024',  uploader: 'HR Team',    type: 'pdf', employeeName: 'Hamza Ali',     expiresOn: undefined,      isLocked: false },
    { id: 10, name: 'ID_Verification_Hamza.pdf',       category: 'Identity',    size: '640 KB', updated: 'Feb 5, 2024',  uploader: 'HR Team',    type: 'pdf', employeeName: 'Hamza Ali',     expiresOn: 'Nov 20, 2028', isLocked: false },
    { id: 11, name: 'NDA_Agreement_Hamza.pdf',         category: 'Legal',       size: '310 KB', updated: 'Feb 5, 2024',  uploader: 'Legal Dept', type: 'pdf', employeeName: 'Hamza Ali',     expiresOn: undefined,      isLocked: false },
    { id: 12, name: 'Performance_Review_Hamza.pdf',    category: 'Performance', size: '480 KB', updated: 'Dec 22, 2025', uploader: 'Lisa Park',  type: 'pdf', employeeName: 'Hamza Ali',     expiresOn: undefined,      isLocked: false },
    // Lisa Park
    { id: 13, name: 'Employment_Contract_Lisa.pdf',    category: 'Contract',    size: '1.3 MB', updated: 'Mar 1, 2023',  uploader: 'HR Team',    type: 'pdf', employeeName: 'Lisa Park',     expiresOn: undefined,      isLocked: false },
    { id: 14, name: 'Manager_Agreement_Lisa.pdf',      category: 'Legal',       size: '340 KB', updated: 'Mar 1, 2023',  uploader: 'Legal Dept', type: 'pdf', employeeName: 'Lisa Park',     expiresOn: undefined,      isLocked: false },
    { id: 15, name: 'Health_Insurance_Lisa.pdf',       category: 'Benefits',    size: '180 KB', updated: 'Jan 3, 2026',  uploader: 'HR Team',    type: 'pdf', employeeName: 'Lisa Park',     expiresOn: 'Dec 31, 2026', isLocked: false },
    // Marcus Chen
    { id: 16, name: 'Employment_Contract_Marcus.pdf',  category: 'Contract',    size: '1.0 MB', updated: 'Jun 15, 2023', uploader: 'HR Team',    type: 'pdf', employeeName: 'Marcus Chen',   expiresOn: undefined,      isLocked: false },
    { id: 17, name: 'ID_Verification_Marcus.pdf',      category: 'Identity',    size: '590 KB', updated: 'Jun 15, 2023', uploader: 'HR Team',    type: 'pdf', employeeName: 'Marcus Chen',   expiresOn: 'Sep 5, 2026',  isLocked: false },
    { id: 18, name: 'Tax_Form_W4_Marcus_2026.pdf',     category: 'Tax',         size: '280 KB', updated: 'Jan 3, 2026',  uploader: 'Payroll',    type: 'pdf', employeeName: 'Marcus Chen',   expiresOn: undefined,      isLocked: false },
];

// Map auth user name → employee name in documents
function resolveEmployeeName(authName: string): string {
    const map: Record<string, string> = {
        'Sara Employee': 'Sara Kim',
        'Sara Kim':      'Sara Kim',
        'Hamza Ali':     'Hamza Ali',
        'Lisa Park':     'Lisa Park',
        'Marcus Chen':   'Marcus Chen',
    };
    return map[authName] ?? authName;
}

const categoryIcons: Record<string, React.ReactNode> = {
    'Contract':     <Briefcase size={13} />,
    'Offer':        <File size={13} />,
    'Identity':     <User size={13} />,
    'Legal':        <Shield size={13} />,
    'Benefits':     <Heart size={13} />,
    'Tax':          <FileText size={13} />,
    'Performance':  <FileText size={13} />,
    'Compensation': <FileText size={13} />,
};

const categoryColors: Record<string, { bg: string; text: string }> = {
    'Contract':     { bg: '#EFF6FF', text: '#2563EB' },
    'Offer':        { bg: '#F0FDF4', text: '#16A34A' },
    'Identity':     { bg: '#FFF7ED', text: '#EA580C' },
    'Legal':        { bg: '#FFF1F2', text: '#BE123C' },
    'Benefits':     { bg: '#F0FDFA', text: '#0D9488' },
    'Tax':          { bg: '#FEFCE8', text: '#CA8A04' },
    'Performance':  { bg: '#F5F3FF', text: '#7C3AED' },
    'Compensation': { bg: '#FDF4FF', text: '#A21CAF' },
};

export default function DocumentsIndex() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const role = user.role;
    const isManager = role === 'manager' || role === 'owner' || role === 'super_admin';

    const myName = resolveEmployeeName(user.name);
    const myDocs  = isManager ? ALL_DOCUMENTS : ALL_DOCUMENTS.filter(d => d.employeeName === myName);

    const [search,      setSearch]      = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selected,    setSelected]    = useState<number | null>(null);

    const categories = ['All', ...Array.from(new Set(myDocs.map(d => d.category)))];

    const filtered = myDocs.filter(d => {
        const textOk = d.name.toLowerCase().includes(search.toLowerCase()) ||
                       d.category.toLowerCase().includes(search.toLowerCase());
        const catOk  = activeCategory === 'All' || d.category === activeCategory;
        return textOk && catOk;
    });

    const selectedDoc = myDocs.find(d => d.id === selected);

    return (
        <AppLayout title="Documents">
            <Head title="Documents" />

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)',
                borderRadius: 16, padding: '24px 28px', marginBottom: 24,
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
                <div style={{ position:'absolute', bottom:-30, left:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />
                <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                        <div style={{ width:48, height:48, borderRadius:12, background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <FileText size={22} color="#C4B5FD" />
                        </div>
                        <div>
                            <p style={{ margin:0, fontSize:11, fontWeight:600, color:'rgba(196,181,253,0.8)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                                {isManager ? 'Payroll' : 'Employee'}
                            </p>
                            <h2 style={{ margin:'2px 0 0', fontSize:22, fontWeight:800, color:'#fff' }}>
                                {isManager ? 'Document Management' : 'My Documents'}
                            </h2>
                            <p style={{ margin:'3px 0 0', fontSize:13, color:'rgba(255,255,255,0.55)' }}>
                                {isManager
                                    ? 'Manage all employee HR documents and records'
                                    : `Your personal HR documents and records — ${myDocs.length} files`}
                            </p>
                        </div>
                    </div>
                    <button style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'10px 16px', cursor:'pointer', color:'#fff', fontSize:13, fontWeight:500 }}>
                        <Upload size={15} /> Upload Document
                    </button>
                </div>
            </div>

            {/* Search + Category filters */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid #E2E8F0', borderRadius:10, padding:'8px 14px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', minWidth:220 }}>
                    <Search size={14} color="#94A3B8" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search documents..."
                        style={{ border:'none', outline:'none', fontSize:13, color:'#374151', background:'transparent', flex:1 }}
                    />
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            style={{
                                padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer',
                                border: activeCategory === cat ? '1.5px solid #7C3AED' : '1.5px solid #E2E8F0',
                                background: activeCategory === cat ? '#F5F3FF' : '#fff',
                                color: activeCategory === cat ? '#7C3AED' : '#64748B',
                                transition:'all 0.15s',
                            }}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns: selectedDoc ? '1fr 340px' : '1fr', gap:20 }}>
                {/* Document grid */}
                <div>
                    {filtered.length === 0 ? (
                        <div style={{ background:'#fff', border:'1px solid #EDE9FE', borderRadius:12, padding:'60px 20px', textAlign:'center', color:'#94A3B8' }}>
                            <FileText size={36} style={{ opacity:0.25, marginBottom:12 }} />
                            <p style={{ margin:0, fontSize:14, fontWeight:600 }}>No documents found</p>
                            <p style={{ margin:'4px 0 0', fontSize:12 }}>Try adjusting your search or category filter</p>
                        </div>
                    ) : (
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:14 }}>
                            {filtered.map(doc => {
                                const catStyle = categoryColors[doc.category] ?? { bg:'#F8FAFC', text:'#64748B' };
                                const isSelected = selected === doc.id;
                                return (
                                    <div key={doc.id}
                                        onClick={() => setSelected(isSelected ? null : doc.id)}
                                        style={{
                                            background:'#fff', border: isSelected ? '1.5px solid #7C3AED' : '1px solid #EDE9FE',
                                            borderRadius:12, padding:'16px', cursor:'pointer',
                                            boxShadow: isSelected ? '0 0 0 3px rgba(124,58,237,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
                                            transition:'all 0.15s',
                                        }}
                                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor='#C4B5FD'; }}
                                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor='#EDE9FE'; }}
                                    >
                                        {/* Top row */}
                                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                                            <div style={{ width:40, height:40, borderRadius:10, background:catStyle.bg, display:'flex', alignItems:'center', justifyContent:'center', color:catStyle.text }}>
                                                {categoryIcons[doc.category] ?? <FileText size={16} />}
                                            </div>
                                            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                                                {doc.isLocked && <Lock size={13} color="#94A3B8" />}
                                                <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20, background:catStyle.bg, color:catStyle.text, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                                                    {doc.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <p style={{ margin:'0 0 4px', fontSize:13, fontWeight:700, color:'#0F172A', lineHeight:1.4 }}>{doc.name}</p>
                                        <p style={{ margin:0, fontSize:11, color:'#94A3B8' }}>{doc.size} · Updated {doc.updated}</p>

                                        {/* Expiry */}
                                        {doc.expiresOn && (
                                            <p style={{ margin:'8px 0 0', fontSize:11, color:'#D97706', fontWeight:600 }}>
                                                ⚠ Expires {doc.expiresOn}
                                            </p>
                                        )}

                                        {/* Manager label */}
                                        {isManager && (
                                            <p style={{ margin:'6px 0 0', fontSize:11, color:'#64748B' }}>👤 {doc.employeeName}</p>
                                        )}

                                        {/* Actions */}
                                        <div style={{ display:'flex', gap:8, marginTop:14, paddingTop:12, borderTop:'1px solid #F1F5F9' }}>
                                            <button
                                                onClick={e => { e.stopPropagation(); setSelected(doc.id); }}
                                                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'6px 0', background:'#F5F3FF', border:'none', borderRadius:8, cursor:'pointer', color:'#7C3AED', fontSize:12, fontWeight:600 }}>
                                                <Eye size={13} /> View
                                            </button>
                                            {doc.isLocked ? (
                                                <button style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'6px 0', background:'#F8FAFC', border:'none', borderRadius:8, cursor:'not-allowed', color:'#94A3B8', fontSize:12 }}>
                                                    <Lock size={13} /> Locked
                                                </button>
                                            ) : (
                                                <button style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'6px 0', background:'#F0FDF4', border:'none', borderRadius:8, cursor:'pointer', color:'#16A34A', fontSize:12, fontWeight:600 }}>
                                                    <Download size={13} /> Download
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Detail panel */}
                {selectedDoc && (
                    <div style={{ background:'#fff', border:'1px solid #EDE9FE', borderRadius:12, overflow:'hidden', height:'fit-content', boxShadow:'0 1px 3px rgba(124,58,237,0.06)' }}>
                        <div style={{ background:'linear-gradient(135deg,#1E1B4B,#7C3AED)', padding:'20px 22px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                                <div style={{ width:44, height:44, borderRadius:12, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#C4B5FD' }}>
                                    {categoryIcons[selectedDoc.category] ?? <FileText size={20} />}
                                </div>
                                <button onClick={() => setSelected(null)}
                                    style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:6, width:28, height:28, cursor:'pointer', color:'#fff', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    ×
                                </button>
                            </div>
                            <p style={{ margin:'14px 0 4px', fontSize:15, fontWeight:700, color:'#fff', lineHeight:1.3 }}>{selectedDoc.name}</p>
                            <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.55)' }}>{selectedDoc.category} · {selectedDoc.size}</p>
                        </div>
                        <div style={{ padding:'16px 20px' }}>
                            {[
                                { label:'Employee',    value: selectedDoc.employeeName },
                                { label:'Uploaded by', value: selectedDoc.uploader },
                                { label:'Last updated',value: selectedDoc.updated },
                                { label:'File size',   value: selectedDoc.size },
                                ...(selectedDoc.expiresOn ? [{ label:'Expires on', value: selectedDoc.expiresOn }] : []),
                                { label:'Status',      value: selectedDoc.isLocked ? '🔒 Locked' : '✅ Available' },
                            ].map(row => (
                                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #F5F3FF' }}>
                                    <span style={{ fontSize:12, color:'#64748B' }}>{row.label}</span>
                                    <span style={{ fontSize:12, fontWeight:600, color:'#0F172A' }}>{row.value}</span>
                                </div>
                            ))}
                            <div style={{ display:'flex', gap:8, marginTop:16 }}>
                                <button style={{ flex:1, padding:'9px 0', background:'#F5F3FF', border:'none', borderRadius:8, cursor:'pointer', color:'#7C3AED', fontSize:13, fontWeight:600 }}>
                                    View
                                </button>
                                {selectedDoc.isLocked ? (
                                    <button style={{ flex:1, padding:'9px 0', background:'#F8FAFC', border:'none', borderRadius:8, cursor:'not-allowed', color:'#94A3B8', fontSize:13 }}>
                                        🔒 Locked
                                    </button>
                                ) : (
                                    <button style={{ flex:1, padding:'9px 0', background:'#ECFDF5', border:'none', borderRadius:8, cursor:'pointer', color:'#16A34A', fontSize:13, fontWeight:600 }}>
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
