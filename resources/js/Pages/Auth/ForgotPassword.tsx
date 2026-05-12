import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ArrowRight, Mail, ShieldCheck, KeyRound, Clock } from 'lucide-react';

const steps = [
    { icon: Mail,        text: 'Enter your email address below' },
    { icon: ShieldCheck, text: 'We\'ll send you a secure reset link' },
    { icon: KeyRound,    text: 'Choose a new password to regain access' },
];

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="flex min-h-screen">
            <Head title="Forgot Password" />

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
                        <KeyRound size={28} className="text-purple-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                        Locked out?<br />
                        <span className="text-purple-400">We've got you.</span>
                    </h1>
                    <p className="text-white/60 text-base mb-10 max-w-sm leading-relaxed">
                        Password resets are quick and secure. You'll be back in your workspace in minutes.
                    </p>

                    <div className="space-y-5">
                        {steps.map(({ icon: Icon, text }, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                                    {i + 1}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon size={14} className="text-purple-400 shrink-0" />
                                    <span className="text-sm text-white/75">{text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative border-t border-white/10 pt-6 flex items-center gap-2 text-white/40 text-sm">
                    <Clock size={14} />
                    Reset links expire after 60 minutes for security.
                </div>
            </div>

            {/* â”€â”€ Right panel â”€â”€ */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <span className="text-2xl font-bold text-purple-900">Teamwork Pro</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Forgot your password?</h2>
                        <p className="mt-1.5 text-sm text-slate-500">
                            No worries â€” enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                autoFocus
                                placeholder="you@company.com"
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-0 transition-colors"
                            />
                            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)', border: 'none' }}
                            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
                        >
                            {processing ? 'Sendingâ€¦' : <><Mail size={15} /> Send reset link <ArrowRight size={15} /></>}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Remembered it?{' '}
                        <Link href={route('login')} className="font-medium text-purple-600 hover:text-purple-700">
                            Back to sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


