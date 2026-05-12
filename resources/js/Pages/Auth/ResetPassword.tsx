import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { ArrowRight, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';

const rules = [
    'At least 8 characters long',
    'Mix of letters and numbers',
    'Unique â€” not used before',
];

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });
    const [showPass, setShowPass]     = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <div className="flex min-h-screen">
            <Head title="Reset Password" />

            {/* â”€â”€ Left panel â”€â”€ */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-purple-900 px-12 py-10 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-700 opacity-40" />
                    <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-brand-600 opacity-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full border border-white/5" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full border border-white/5" />
                </div>

                <div className="relative">
                    <span className="text-2xl font-bold tracking-tight text-white">Teamwork Pro</span>
                    <span className="ml-2 text-sm text-white/50">Unified Management Platform</span>
                </div>

                <div className="relative">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                        <ShieldCheck size={28} className="text-purple-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                        Set a strong<br />new password.<br />
                        <span className="text-purple-400">Stay secure.</span>
                    </h1>
                    <p className="text-white/60 text-base mb-10 max-w-sm leading-relaxed">
                        Choose a password you haven't used before and keep it somewhere safe.
                    </p>

                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Password tips</p>
                        {rules.map(rule => (
                            <div key={rule} className="flex items-center gap-3">
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-400">
                                    <Check size={11} className="text-white" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-white/75">{rule}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative border-t border-white/10 pt-6">
                    <p className="text-sm text-white/50 italic">"Security and simplicity, hand in hand."</p>
                    <p className="text-xs text-white/30 mt-1">â€” Teamwork Pro</p>
                </div>
            </div>

            {/* â”€â”€ Right panel â”€â”€ */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <span className="text-2xl font-bold text-purple-900">Teamwork Pro</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Set new password</h2>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Your new password must be different from previously used passwords.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                autoComplete="username"
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-0 transition-colors"
                            />
                            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder="Min. 8 characters"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-0 transition-colors"
                                />
                                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Repeat your password"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-0 transition-colors"
                                />
                                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="mt-1.5 text-xs text-red-500">{errors.password_confirmation}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)', border: 'none' }}
                            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
                        >
                            {processing ? 'Resettingâ€¦' : <><ShieldCheck size={15} /> Reset Password <ArrowRight size={15} /></>}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        <Link href={route('login')} className="font-medium text-purple-600 hover:text-purple-700">
                            Back to sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


