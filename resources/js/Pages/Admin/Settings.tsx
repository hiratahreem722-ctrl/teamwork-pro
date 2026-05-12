import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Save, CheckCircle2, Settings2 } from 'lucide-react';

const tabs = ['General', 'Email', 'Storage', 'Real-time', 'MCP'];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 gap-4 items-start py-4 border-b border-slate-50 last:border-0">
            <div>
                <p className="text-sm font-medium text-slate-700">{label}</p>
                {hint && <p className="text-xs text-slate-400 mt-0.5 leading-snug">{hint}</p>}
            </div>
            <div className="col-span-2">{children}</div>
        </div>
    );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-brand-600' : 'bg-slate-200'}`}>
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
}

const inputCls = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-0 transition-colors";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('General');
    const [mcpEnabled, setMcpEnabled] = useState(true);
    const [mcpReadOnly, setMcpReadOnly] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    return (
        <AppLayout title="Settings">
            <Head title="System Settings" />

            {/* Hero header */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-brand-900 px-7 py-8">
                <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-brand-700 opacity-40 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-brand-600 opacity-20 pointer-events-none" />
                <div className="relative flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Settings2 size={22} className="text-brand-400" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-0.5">Administration</p>
                        <h2 className="text-2xl font-bold text-white">System Settings</h2>
                        <p className="mt-0.5 text-sm text-white/60">Platform configuration and integrations</p>
                    </div>
                </div>
            </div>

            {/* Tab nav */}
            <div className="mb-6 flex gap-1 border-b border-slate-200">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-5 max-w-2xl">

                {activeTab === 'General' && (
                    <div className="rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-700 mb-1">Platform Settings</h3>
                        <p className="text-xs text-slate-400 mb-4">Core configuration for your Teamwork Pro deployment.</p>
                        <Field label="Platform Name" hint="Shown in emails and browser tab">
                            <input defaultValue="Unified Management Platform" className={inputCls} />
                        </Field>
                        <Field label="App URL" hint="Base URL of your deployment">
                            <input defaultValue="https://Teamwork Pro.yourdomain.com" className={inputCls} />
                        </Field>
                        <Field label="Default Timezone">
                            <select className={inputCls}>
                                <option>UTC</option>
                                <option>Asia/Karachi</option>
                                <option>America/New_York</option>
                                <option>Europe/London</option>
                            </select>
                        </Field>
                        <Field label="Maintenance Mode" hint="Temporarily disable access for all users">
                            <Toggle enabled={false} onChange={() => {}} />
                        </Field>
                    </div>
                )}

                {activeTab === 'Email' && (
                    <div className="rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-700 mb-1">Mail Configuration</h3>
                        <p className="text-xs text-slate-400 mb-4">SMTP and transactional email settings.</p>
                        <Field label="Mail Driver">
                            <select className={inputCls}><option>SMTP</option><option>Mailgun</option><option>SES</option><option>Log (Dev)</option></select>
                        </Field>
                        <Field label="SMTP Host"><input defaultValue="smtp.mailgun.org" className={inputCls} /></Field>
                        <Field label="SMTP Port"><input defaultValue="587" className={inputCls} /></Field>
                        <Field label="From Address"><input defaultValue="no-reply@Teamwork Pro.yourdomain.com" className={inputCls} /></Field>
                        <Field label="Encryption"><select className={inputCls}><option>TLS</option><option>SSL</option><option>None</option></select></Field>
                    </div>
                )}

                {activeTab === 'Storage' && (
                    <div className="rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-700 mb-1">File Storage</h3>
                        <p className="text-xs text-slate-400 mb-4">Configure where uploaded files are stored.</p>
                        <Field label="Storage Driver">
                            <select className={inputCls}><option>Local</option><option>S3-Compatible</option></select>
                        </Field>
                        <Field label="S3 Bucket"><input defaultValue="Teamwork Pro-uploads" className={inputCls} /></Field>
                        <Field label="S3 Region"><input defaultValue="us-east-1" className={inputCls} /></Field>
                        <Field label="Max Upload Size" hint="Per file limit">
                            <div className="flex items-center gap-2">
                                <input defaultValue="50" className={`${inputCls} w-24`} />
                                <span className="text-sm text-slate-500">MB</span>
                            </div>
                        </Field>
                    </div>
                )}

                {activeTab === 'Real-time' && (
                    <div className="rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-700 mb-1">Laravel Reverb (WebSockets)</h3>
                        <p className="text-xs text-slate-400 mb-4">Real-time event broadcasting configuration.</p>
                        <Field label="Reverb Host"><input defaultValue="0.0.0.0" className={inputCls} /></Field>
                        <Field label="Reverb Port"><input defaultValue="8080" className={inputCls} /></Field>
                        <Field label="Enable SSL" hint="For production deployments"><Toggle enabled={true} onChange={() => {}} /></Field>
                        <Field label="Max Connections" hint="Per server instance"><input defaultValue="1000" className={inputCls} /></Field>
                        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle2 size={16} /> Reverb server is connected and healthy.
                        </div>
                    </div>
                )}

                {activeTab === 'MCP' && (
                    <>
                        <div className="rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-1">Model Context Protocol (MCP)</h3>
                            <p className="text-xs text-slate-400 mb-4">Allow AI assistants to connect and interact with Teamwork Pro data.</p>
                            <Field label="Enable MCP Server" hint="Allow AI assistants to connect to Teamwork Pro">
                                <Toggle enabled={mcpEnabled} onChange={setMcpEnabled} />
                            </Field>
                            <Field label="Read-only Mode" hint="Disable write tools (create/update) for AI">
                                <Toggle enabled={mcpReadOnly} onChange={setMcpReadOnly} />
                            </Field>
                            <Field label="MCP Server URL" hint="Share this with AI clients">
                                <input readOnly value="https://Teamwork Pro.yourdomain.com/mcp" className={`${inputCls} bg-slate-50 cursor-default`} />
                            </Field>
                            <Field label="API Token" hint="Rotate this token to revoke all AI access">
                                <div className="flex gap-2">
                                    <input readOnly value="sk-Teamwork Pro-â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" className={`flex-1 ${inputCls} bg-slate-50`} />
                                    <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Rotate</button>
                                </div>
                            </Field>
                        </div>
                        <div className="rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-1">MCP Capabilities</h3>
                            <p className="text-xs text-slate-400 mb-4">Control which data and actions AI assistants can access.</p>
                            {[
                                { label: 'Read Projects & Tasks',  hint: 'AI can list and read project data',        on: true  },
                                { label: 'Read Time Logs',         hint: 'AI can access logged hours per user',      on: true  },
                                { label: 'Create Tasks',           hint: 'AI can add new tasks on behalf of users',  on: !mcpReadOnly },
                                { label: 'Update Task Status',     hint: 'AI can move tasks between columns',        on: !mcpReadOnly },
                                { label: 'Read Financial Data',    hint: 'AI can access budget and margin data',     on: false },
                            ].map(c => (
                                <Field key={c.label} label={c.label} hint={c.hint}>
                                    <Toggle enabled={c.on} onChange={() => {}} />
                                </Field>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex items-center gap-3 pt-2">
                    <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
                        <Save size={15} /> Save Settings
                    </button>
                    {saved && (
                        <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                            <CheckCircle2 size={15} /> Saved!
                        </span>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

