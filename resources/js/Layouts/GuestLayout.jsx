import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cbx-background)] px-6 py-12">
            <div className="text-center">
                <Link href="/">
                    <ApplicationLogo className="mx-auto h-16 w-16 fill-current text-[var(--cbx-primary)]" />
                </Link>
                <p className="mt-4 cbx-kicker">Customer Access</p>
                <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Colorbox Account</h1>
            </div>

            <div className="cbx-card mt-8 w-full overflow-hidden px-6 py-6 sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
