import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Log in" />

            {/* Left Side - Login Form */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 border-r border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                <div className="max-w-md w-full space-y-8">
                    {status && (
                        <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            {status}
                        </div>
                    )}

                    <div className="space-y-2">
                        <h1 className="font-heading text-[48px] leading-[1.1] font-bold tracking-tight text-[var(--cbx-primary)]">
                            Welcome back.
                        </h1>
                        <p className="text-lg text-[var(--cbx-on-surface-variant)]">
                            Sign in to your account to continue shopping.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={submit}>
                        <div className="space-y-1">
                            <InputLabel htmlFor="email" value="EMAIL ADDRESS" className="text-xs font-bold uppercase tracking-wider" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full p-[10px] border border-[var(--cbx-border-subtle)] rounded-lg focus:ring-2 focus:ring-[var(--cbx-primary)] focus:border-transparent outline-none transition-all"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter your email"
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-end">
                                <InputLabel htmlFor="password" value="PASSWORD" className="text-xs font-bold uppercase tracking-wider" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-[var(--cbx-secondary)] hover:underline"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full p-[10px] border border-[var(--cbx-border-subtle)] rounded-lg focus:ring-2 focus:ring-[var(--cbx-primary)] focus:border-transparent outline-none transition-all"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center gap-3 py-2">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="text-sm text-[var(--cbx-on-surface-variant)]">Remember me</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)] py-4 rounded-lg font-heading text-xl font-semibold hover:opacity-90 active:scale-[0.98] duration-150 transition-all uppercase tracking-widest"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[var(--cbx-border-subtle)]"></span>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--cbx-surface-container-lowest)] text-[var(--cbx-on-surface-variant)] text-xs font-bold uppercase">
                                Or Continue With
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 border border-[var(--cbx-border-subtle)] py-3 rounded-lg hover:bg-[var(--cbx-surface-container-low)] transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-xs font-bold uppercase">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 border border-[var(--cbx-border-subtle)] py-3 rounded-lg hover:bg-[var(--cbx-surface-container-low)] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            <span className="text-xs font-bold uppercase">Apple</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side - Register CTA */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden bg-[var(--cbx-surface-alt)]">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" style={{ backgroundColor: 'var(--cbx-brand-light-pink)' }}></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] opacity-10 -ml-32 -mb-32" style={{ backgroundColor: 'var(--cbx-secondary)' }}></div>

                <div className="max-w-md w-full space-y-8 relative z-10 text-center">
                    <div className="space-y-2">
                        <h1 className="font-heading text-[48px] leading-[1.1] font-bold tracking-tight text-[var(--cbx-primary)]">
                            New here?
                        </h1>
                        <p className="text-lg text-[var(--cbx-on-surface-variant)]">
                            Join our community for exclusive drops and rewards.
                        </p>
                    </div>

                    <Link
                        href={route('register')}
                        className="inline-block w-full bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)] py-4 rounded-lg font-heading text-xl font-semibold hover:opacity-90 active:scale-[0.98] duration-150 transition-all uppercase tracking-widest"
                    >
                        Join Now
                    </Link>

                    <div className="bg-[var(--cbx-surface-container)] rounded-xl p-6 flex items-center gap-4 border border-[var(--cbx-border-subtle)]">
                        <img
                            className="w-16 h-16 rounded-lg object-cover"
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face"
                            alt="Fashion model"
                        />
                        <div>
                            <p className="text-xs font-bold uppercase text-[var(--cbx-secondary)]">Member Exclusive</p>
                            <p className="font-bold">Get 15% OFF your first order</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}