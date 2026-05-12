import FlashMessages from '@/Components/FlashMessages';
import { Link } from '@inertiajs/react';
import {
    Bell,
    Boxes,
    LayoutDashboard,
    MapPin,
    Megaphone,
    Menu,
    Package2,
    ReceiptText,
    Search,
    Store,
    X,
} from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', routeName: 'admin.dashboard', icon: LayoutDashboard },
    { key: 'catalog', label: 'Catalog', routeName: 'admin.catalog', icon: Package2 },
    { key: 'merchandising', label: 'Merchandising', routeName: 'admin.merchandising', icon: Megaphone },
    { key: 'locations', label: 'Store locations', routeName: 'admin.locations', icon: MapPin },
    { key: 'inventory', label: 'Inventory', routeName: 'admin.inventory', icon: Boxes },
    { key: 'orders', label: 'Orders', routeName: 'admin.orders.index', icon: ReceiptText },
];

function SidebarLink({ item, active, onClick }) {
    const Icon = item.icon;

    return (
        <Link
            href={route(item.routeName)}
            onClick={onClick}
            className={[
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                active
                    ? 'bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)]'
                    : 'text-[var(--cbx-on-surface-variant)] hover:bg-[var(--cbx-surface-container-high)] hover:text-[var(--cbx-on-surface)]',
            ].join(' ')}
        >
            <Icon size={18} strokeWidth={1.9} />
            <span>{item.label}</span>
        </Link>
    );
}

export default function AdminLayout({
    title,
    description = null,
    actions = null,
    section = 'dashboard',
    toolbarSearchValue = '',
    toolbarSearchAction = route('admin.catalog'),
    toolbarSearchPlaceholder = 'Search this section...',
    children,
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const activeSection = navigationItems.find((item) => item.key === section);

    return (
        <div className="min-h-screen bg-[var(--cbx-background)] text-[var(--cbx-on-background)]">
            {isSidebarOpen ? <div className="fixed inset-0 z-40 bg-black/35 lg:hidden" onClick={() => setIsSidebarOpen(false)} /> : null}

            <aside className={[
                'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface)] px-4 py-6 transition-transform duration-200 lg:translate-x-0',
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}>
                <div className="mb-8 flex items-start justify-between px-3">
                    <div>
                        <Link href={route('admin.dashboard')} className="font-heading text-3xl font-bold tracking-[-0.02em] text-[var(--cbx-primary)]">
                            COLORBOX
                        </Link>
                        <p className="mt-1 text-sm text-[var(--cbx-on-surface-variant)]">Admin CMS</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--cbx-on-surface-variant)] hover:bg-[var(--cbx-surface-container-high)] lg:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {navigationItems.map((item) => (
                        <SidebarLink
                            key={item.key}
                            item={item}
                            active={item.key === section}
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    ))}
                </nav>

                <div className="border-t border-[var(--cbx-border-subtle)] pt-6">
                    <Link
                        href={route('home')}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--cbx-outline-variant)] px-4 py-3 text-sm font-semibold text-[var(--cbx-on-surface)] transition-colors hover:bg-[var(--cbx-surface-container-low)]"
                    >
                        <Store size={16} />
                        <span>View storefront</span>
                    </Link>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-30 border-b border-[var(--cbx-border-subtle)] bg-[color:rgba(249,249,249,0.96)] backdrop-blur">
                    <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-[4%]">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--cbx-border-subtle)] text-[var(--cbx-on-surface-variant)] hover:bg-[var(--cbx-surface-container-low)] lg:hidden"
                        >
                            <Menu size={18} />
                        </button>

                        <form action={toolbarSearchAction} method="get" className="relative w-full max-w-xl">
                            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cbx-on-surface-variant)]" />
                            <input
                                type="text"
                                name="q"
                                defaultValue={toolbarSearchValue}
                                placeholder={toolbarSearchPlaceholder}
                                className="cbx-field py-2 pl-10 pr-4 text-sm"
                            />
                        </form>

                        <div className="ml-auto flex items-center gap-2 sm:gap-3">
                            <Link
                                href={route('admin.orders.index')}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--cbx-on-surface-variant)] transition-colors hover:bg-[var(--cbx-surface-container-low)] hover:text-[var(--cbx-on-surface)]"
                            >
                                <Bell size={18} />
                                <span className="sr-only">Open orders</span>
                            </Link>
                            <div className="hidden h-8 w-px bg-[var(--cbx-border-subtle)] sm:block" />
                            <span className="hidden text-xs font-bold tracking-[0.05em] text-[var(--cbx-primary)] sm:block">COLORBOX CMS</span>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-[4%] lg:py-8">
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4 border-b border-[var(--cbx-border-subtle)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="cbx-kicker">{activeSection?.label || 'Admin workspace'}</p>
                                <h1 className="mt-2 font-heading text-3xl font-bold text-[var(--cbx-on-surface)] sm:text-4xl">{title}</h1>
                                {description ? (
                                    <p className="mt-2 max-w-2xl text-sm text-[var(--cbx-on-surface-variant)] sm:text-base">{description}</p>
                                ) : null}
                            </div>
                            {actions ? <div className="shrink-0">{actions}</div> : null}
                        </div>

                        <FlashMessages />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
