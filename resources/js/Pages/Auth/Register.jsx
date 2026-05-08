import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        newsletter: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Register" />

            {/* Left Side - Login CTA */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 border-r border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="space-y-2">
                        <h1 className="font-heading text-[48px] leading-[1.1] font-bold tracking-tight text-[var(--cbx-primary)]">
                            Welcome back.
                        </h1>
                        <p className="text-lg text-[var(--cbx-on-surface-variant)]">
                            Sign in to your account to continue shopping.
                        </p>
                    </div>

                    <Link
                        href={route('login')}
                        className="inline-block w-full bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)] py-4 rounded-lg font-heading text-xl font-semibold hover:opacity-90 active:scale-[0.98] duration-150 transition-all uppercase tracking-widest"
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden bg-[var(--cbx-surface-alt)]">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" style={{ backgroundColor: 'var(--cbx-brand-light-pink)' }}></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] opacity-10 -ml-32 -mb-32" style={{ backgroundColor: 'var(--cbx-secondary)' }}></div>

                <div className="max-w-md w-full space-y-8 relative z-10">
                    <div className="space-y-2">
                        <h1 className="font-heading text-[48px] leading-[1.1] font-bold tracking-tight text-[var(--cbx-primary)]">
                            New here?
                        </h1>
                        <p className="text-lg text-[var(--cbx-on-surface-variant)]">
                            Join our community for exclusive drops and rewards.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={submit}>
                        <div className="space-y-1">
                            <InputLabel htmlFor="name" value="FULL NAME" className="text-xs font-bold uppercase tracking-wider" />

                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="w-full p-[10px] border border-[var(--cbx-border-subtle)] rounded-lg focus:ring-2 focus:ring-[var(--cbx-secondary)] focus:border-transparent outline-none transition-all"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                                required
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="space-y-1">
                            <InputLabel htmlFor="email" value="EMAIL ADDRESS" className="text-xs font-bold uppercase tracking-wider" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full p-[10px] border border-[var(--cbx-border-subtle)] rounded-lg focus:ring-2 focus:ring-[var(--cbx-secondary)] focus:border-transparent outline-none transition-all"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="john@example.com"
                                required
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="space-y-1">
                            <InputLabel htmlFor="phone" value="PHONE NUMBER" className="text-xs font-bold uppercase tracking-wider" />

                            <TextInput
                                id="phone"
                                type="tel"
                                name="phone"
                                value={data.phone}
                                className="w-full p-[10px] border border-[var(--cbx-border-subtle)] rounded-lg focus:ring-2 focus:ring-[var(--cbx-secondary)] focus:border-transparent outline-none transition-all"
                                autoComplete="tel"
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+62 812 3456 7890"
                            />

                            <InputError message={errors.phone} className="mt-2" />
                        </div>

                        <div className="space-y-1">
                            <InputLabel htmlFor="password" value="PASSWORD" className="text-xs font-bold uppercase tracking-wider" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full p-[10px] border border-[var(--cbx-border-subtle)] rounded-lg focus:ring-2 focus:ring-[var(--cbx-secondary)] focus:border-transparent outline-none transition-all"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Create a strong password"
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="space-y-1">
                            <InputLabel htmlFor="password_confirmation" value="CONFIRM PASSWORD" className="text-xs font-bold uppercase tracking-wider" />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full p-[10px] border border-[var(--cbx-border-subtle)] rounded-lg focus:ring-2 focus:ring-[var(--cbx-secondary)] focus:border-transparent outline-none transition-all"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />

                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <input
                                type="checkbox"
                                id="newsletter"
                                name="newsletter"
                                checked={data.newsletter}
                                onChange={(e) => setData('newsletter', e.target.checked)}
                                className="h-5 w-5 rounded border-[var(--cbx-border-subtle)] mt-0.5"
                            />
                            <label htmlFor="newsletter" className="text-sm text-[var(--cbx-on-surface-variant)]">
                                Sign me up for the COLORBOX newsletter to receive the latest fashion trends and promotional offers.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)] py-4 rounded-lg font-heading text-xl font-semibold hover:opacity-90 active:scale-[0.98] duration-150 transition-all uppercase tracking-widest"
                        >
                            Join Now
                        </button>
                    </form>

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