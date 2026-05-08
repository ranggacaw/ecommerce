import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AuthLayout({ children, type = 'login' }) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface)]">
                <div className="flex w-full items-center justify-between px-[4%] py-4 max-w-7xl mx-auto">
                    <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-[var(--cbx-primary)]">
                        COLORBOX
                    </Link>
                    <nav className="hidden md:flex gap-8 items-center">
                        <Link className="text-xs font-bold uppercase tracking-wider text-[var(--cbx-on-surface-variant)] hover:text-[var(--cbx-primary)]" href="#">
                            New Arrival
                        </Link>
                        <Link className="text-xs font-bold uppercase tracking-wider text-[var(--cbx-on-surface-variant)] hover:text-[var(--cbx-primary)]" href="#">
                            Clothing
                        </Link>
                        <Link className="text-xs font-bold uppercase tracking-wider text-[var(--cbx-on-surface-variant)] hover:text-[var(--cbx-primary)]" href="#">
                            Accessories
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex flex-1 flex-col md:flex-row">
                {children}
            </main>

            <footer className="border-t border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-alt)]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 px-[4%] py-12 max-w-7xl mx-auto">
                    <div className="space-y-4">
                        <div className="font-heading font-bold text-xl text-[var(--cbx-primary)]">COLORBOX</div>
                        <p className="text-sm text-[var(--cbx-on-surface-variant)] pr-8">Bringing you the latest global trends with a local touch.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase text-[var(--cbx-primary)]">Shop</h4>
                        <nav className="flex flex-col gap-2 text-sm text-[var(--cbx-neutral-mid)]">
                            <Link href="#">New Arrival</Link>
                            <Link href="#">Best Sellers</Link>
                            <Link href="#">Flash Sale</Link>
                        </nav>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase text-[var(--cbx-primary)]">Help</h4>
                        <nav className="flex flex-col gap-2 text-sm text-[var(--cbx-neutral-mid)]">
                            <Link href="#">Shipping & Returns</Link>
                            <Link href="#">Find a Store</Link>
                            <Link href="#">Contact Us</Link>
                        </nav>
                    </div>
                </div>
                <div className="border-t border-[var(--cbx-border-subtle)] py-6">
                    <p className="text-center text-sm text-[var(--cbx-on-surface-variant)]">© 2024 COLORBOX. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}