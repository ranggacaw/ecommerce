import FlashMessages from '@/Components/FlashMessages';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Heart, Search, ShoppingBag, User2 } from 'lucide-react';
import { useState } from 'react';

export default function StorefrontLayout({ title, categories = [], children }) {
    const { auth, cart, appName, navigationCategories } = usePage().props;
    const [query, setQuery] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const categoryLinks = categories.length ? categories : navigationCategories || [];

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route('shop.index'), { q: query }, { preserveState: true });
    };

    const submitOrderTracking = (event) => {
        event.preventDefault();

        if (!trackingNumber.trim()) {
            return;
        }

        router.get(route('orders.show-public', trackingNumber.trim()));
    };

    return (
        <div className="min-h-screen bg-[var(--cbx-background)] text-[var(--cbx-on-background)]">
            <Head title={title} />

            <header className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-[4%] py-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center justify-between gap-6">
                            <div>
                                <p className="cbx-kicker">{appName || 'Colorbox'}</p>
                                <Link href={route('home')} className="mt-2 block font-heading text-3xl font-bold tracking-[-0.02em] text-[var(--cbx-on-surface)]">
                                    Curated daily wear, sharper online.
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:min-w-[34rem] lg:flex-row lg:items-center lg:justify-end">
                            <form onSubmit={submitSearch} className="flex flex-1 items-center gap-3">
                                <div className="relative min-w-0 flex-1">
                                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cbx-neutral-mid)]" />
                                    <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search materials, fits, and collections" className="pl-11" />
                                </div>
                                <Button type="submit" variant="secondary">Search</Button>
                            </form>

                            <div className="flex flex-wrap items-center gap-2 text-sm">
                            {auth.user ? (
                                <>
                                    <Link href={route('dashboard')} className="cbx-button cbx-button-secondary px-4 py-3">
                                        <span className="inline-flex items-center gap-2"><User2 className="h-4 w-4" />Account</span>
                                    </Link>
                                    <Link href={route('account.wishlist')} className="cbx-button cbx-button-secondary px-4 py-3">
                                        <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4" />Wishlist</span>
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="cbx-button cbx-button-ghost px-4 py-3">
                                        Log out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="cbx-button cbx-button-secondary px-4 py-3">Sign in</Link>
                                    <Link href={route('register')} className="cbx-button cbx-button-primary px-4 py-3">Create account</Link>
                                </>
                            )}
                            <Link href={route('cart.index')} className="cbx-button cbx-button-primary px-4 py-3">
                                <span className="inline-flex items-center gap-2"><ShoppingBag className="h-4 w-4" />Bag ({cart?.count || 0})</span>
                            </Link>
                        </div>
                    </div>
                    </div>

                    <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--cbx-on-surface-variant)]">
                        <Link href={route('shop.index')} className="rounded-full bg-[var(--cbx-surface-container)] px-4 py-2 font-semibold text-[var(--cbx-on-surface)]">Shop</Link>
                        <Link href={route('collections.show', 'new-arrivals')} className="rounded-full px-4 py-2 hover:bg-[var(--cbx-surface-container-low)]">New Arrivals</Link>
                        {categoryLinks.map((category) => (
                            <Link key={category.id} href={route('categories.show', category.slug)} className="rounded-full px-4 py-2 hover:bg-[var(--cbx-surface-container-low)]">
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-10 px-[4%] py-8 lg:py-10">
                <FlashMessages />
                {children}
            </main>

            <footer className="border-t border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] px-[4%] py-10 text-sm text-[var(--cbx-on-surface-variant)]">
                <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
                    <div className="space-y-3">
                        <p className="cbx-kicker">Temukan Kami</p>
                        <p className="font-heading text-xl font-semibold text-[var(--cbx-on-surface)]">COLORBOX</p>
                        <p>Tailored layers, fluid bottoms, and accessories designed for the office-to-evening switch.</p>
                    </div>
                    <div className="space-y-3">
                        <p className="cbx-kicker">Info</p>
                        <Link href={route('shop.index')} className="block hover:text-[var(--cbx-secondary)]">Shop all</Link>
                        <Link href={route('collections.show', 'new-arrivals')} className="block hover:text-[var(--cbx-secondary)]">New arrivals</Link>
                    </div>
                    <div className="space-y-3">
                        <p className="cbx-kicker">Bantuan</p>
                        <Link href={route('cart.index')} className="block hover:text-[var(--cbx-secondary)]">Shopping bag</Link>
                        <Link href={route('login')} className="block hover:text-[var(--cbx-secondary)]">Customer access</Link>
                    </div>
                    <div className="space-y-3">
                        <p className="cbx-kicker">Lacak Pesanan</p>
                        <form onSubmit={submitOrderTracking} className="space-y-3">
                            <Input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="Enter order number" />
                            <Button type="submit" className="w-full">Track order</Button>
                        </form>
                    </div>
                </div>
            </footer>
        </div>
    );
}
