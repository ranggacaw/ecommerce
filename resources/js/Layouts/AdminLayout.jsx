import FlashMessages from '@/Components/FlashMessages';
import { Link } from '@inertiajs/react';

export default function AdminLayout({ title, children }) {
    return (
        <div className="min-h-screen bg-[var(--cbx-background)] text-[var(--cbx-on-background)]">
            <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-[4%] py-8 lg:grid-cols-[250px_1fr]">
                <aside className="cbx-card p-6">
                    <p className="cbx-kicker">Operations</p>
                    <Link href={route('admin.dashboard')} className="mt-4 block font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Colorbox Admin</Link>
                    <nav className="mt-8 space-y-3 text-sm text-[var(--cbx-on-surface-variant)]">
                        <Link href={route('admin.dashboard')} className="block rounded-lg border border-[var(--cbx-outline-variant)] px-4 py-3 hover:border-[var(--cbx-outline)] hover:bg-[var(--cbx-surface-container-low)] hover:text-[var(--cbx-on-surface)]">Catalog and CMS</Link>
                        <Link href={route('home')} className="block rounded-lg border border-[var(--cbx-outline-variant)] px-4 py-3 hover:border-[var(--cbx-outline)] hover:bg-[var(--cbx-surface-container-low)] hover:text-[var(--cbx-on-surface)]">View storefront</Link>
                    </nav>
                </aside>
                <div className="space-y-6">
                    <div>
                        <p className="cbx-kicker">{title}</p>
                        <h1 className="mt-2 font-heading text-4xl font-semibold text-[var(--cbx-on-surface)]">{title}</h1>
                    </div>
                    <FlashMessages />
                    {children}
                </div>
            </div>
        </div>
    );
}
