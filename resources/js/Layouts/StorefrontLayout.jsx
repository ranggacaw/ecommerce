import FlashMessages from '@/Components/FlashMessages';
import StorefrontFooter from '@/Components/Storefront/StorefrontFooter';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Heart, Search, ShoppingBag, User2 } from 'lucide-react';
import { useState } from 'react';

export default function StorefrontLayout({ title, categories = [], children }) {
    const { auth, cart, wishlist, appName, navigationCategories } = usePage().props;
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

            <div className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-highest)]">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-[4%] py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--cbx-neutral-mid)] sm:gap-6">
                    <span className="border-b border-[var(--cbx-primary)] pb-0.5 text-[var(--cbx-primary)]">{appName || 'Colorbox'}</span>
                    <span>Executive</span>
                    <span>et cetera</span>
                    <span>Wrangler</span>
                </div>
            </div>

            <header className="sticky top-0 z-20 border-b border-[var(--cbx-border-subtle)] bg-white backdrop-blur">
                <div className="mx-auto flex max-w-[92rem] flex-col gap-4 px-[4%] py-4">
                    <div className="flex items-center justify-between gap-4">
                        <Link href={route('home')} className="font-heading text-2xl font-black tracking-[-0.03em] text-[var(--cbx-primary)] sm:text-3xl">
                            COLORBOX
                        </Link>

                        <nav className="hidden items-center gap-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--cbx-on-surface-variant)] md:flex">
                            <Link href={route('collections.show', 'new-arrivals')} className="transition hover:text-[var(--cbx-primary)]">New Arrival</Link>
                            <Link href={route('shop.index')} className="transition hover:text-[var(--cbx-primary)]">Clothing</Link>
                            {categoryLinks.slice(0, 2).map((category) => (
                                <Link key={category.id} href={route('categories.show', category.slug)} className="transition hover:text-[var(--cbx-primary)]">
                                    {category.name}
                                </Link>
                            ))}
                            <Link href={route('shop.index')} className="border-b border-[var(--cbx-secondary)] pb-1 text-[var(--cbx-secondary)]">Sale</Link>
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <form onSubmit={submitSearch} className="hidden lg:block">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cbx-neutral-mid)]" />
                                    <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="h-11 w-56 rounded-full border-transparent bg-[var(--cbx-surface-container-low)] pl-11 pr-4" />
                                </div>
                            </form>

                            <Link href={auth.user ? route('dashboard') : route('login')} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] text-[var(--cbx-on-surface)] transition hover:border-[var(--cbx-primary)]">
                                <User2 className="h-4 w-4" />
                            </Link>
                            <Link href={route('account.wishlist')} className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] text-[var(--cbx-on-surface)] transition hover:border-[var(--cbx-primary)]">
                                <Heart className="h-4 w-4" />
                                {wishlist?.count > 0 ? <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--cbx-secondary)] px-1 text-[10px] font-bold text-white">{wishlist.count}</span> : null}
                            </Link>
                            <Link href={route('cart.index')} className="relative grid h-10 w-10 place-items-center rounded-full bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)] transition hover:bg-[var(--cbx-secondary)]">
                                <ShoppingBag className="h-4 w-4" />
                                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--cbx-secondary)] px-1 text-[10px] font-bold text-white">{cart?.count || 0}</span>
                            </Link>
                        </div>
                    </div>

                    <nav className="flex gap-2 overflow-x-auto pb-1 text-[12px] font-medium text-[var(--cbx-on-surface-variant)] md:hidden">
                        <Link href={route('shop.index')} className="whitespace-nowrap rounded-full bg-[var(--cbx-primary)] px-4 py-2 text-white">Shop</Link>
                        <Link href={route('collections.show', 'new-arrivals')} className="whitespace-nowrap rounded-full border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] px-4 py-2">New Arrival</Link>
                        {categoryLinks.slice(0, 3).map((category) => (
                            <Link key={category.id} href={route('categories.show', category.slug)} className="whitespace-nowrap rounded-full border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] px-4 py-2">
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-[92rem] space-y-10 px-[4%] py-8 lg:py-10">
                <FlashMessages />
                {children}
            </main>

            <section className="border-t border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)] px-[4%]">
                <div className="mx-auto grid max-w-[82rem] gap-px bg-[var(--cbx-border-subtle)] lg:grid-cols-2">
                    <div className="bg-[var(--cbx-surface-container-lowest)] px-6 py-8">
                        <p className="cbx-kicker">Track Order</p>
                        <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">Quick order utility</h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--cbx-on-surface-variant)]">Support tools stay accessible, but the presentation is quieter and cleaner.</p>
                        <form onSubmit={submitOrderTracking} className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <Input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="Order ID" className="h-12 flex-1 rounded-md bg-[var(--cbx-surface-container-low)]" />
                            <Button type="submit" className="px-5 py-3">Track</Button>
                        </form>
                    </div>
                    <div className="bg-[var(--cbx-surface-container-lowest)] px-6 py-8">
                        <p className="cbx-kicker">Join the Box</p>
                        <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">Create your account</h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--cbx-on-surface-variant)]">Save favorites, review orders, and move through checkout faster.</p>
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <Link href={auth.user ? route('dashboard') : route('register')} className="cbx-button cbx-button-primary px-5 py-3 text-sm">
                                {auth.user ? 'Open account' : 'Create account'}
                            </Link>
                            {!auth.user ? <Link href={route('login')} className="cbx-button cbx-button-secondary px-5 py-3 text-sm">Sign in</Link> : null}
                        </div>
                    </div>
                </div>
            </section>

            <StorefrontFooter />
        </div>
    );
}
