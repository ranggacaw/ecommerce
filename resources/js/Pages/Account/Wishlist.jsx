import { Button } from '@/Components/ui/Button';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { formatCurrency, productPrimaryImage, productPrice } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { ChevronRight, Heart, ShoppingBag, SlidersHorizontal } from 'lucide-react';

function WishlistCard({ item }) {
    const product = item.product;
    const firstVariant = product.variants?.[0] || null;
    const currentPrice = Number(productPrice(product, firstVariant));
    const comparePrice = Number(product.compare_price || 0);
    const hasComparePrice = comparePrice > currentPrice;
    const eyebrow = (product.category?.name || product.brand || 'Saved item').toUpperCase();

    return (
        <article className="group flex h-full flex-col overflow-hidden border border-[var(--cbx-border-subtle)] bg-white">
            <Link href={route('products.show', product.slug)} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--cbx-surface-container)]">
                    <img
                        src={productPrimaryImage(product)}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {hasComparePrice ? (
                        <div className="absolute left-4 top-4 bg-[var(--cbx-secondary)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                            Sale
                        </div>
                    ) : null}
                    <button
                        type="button"
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--cbx-secondary)] shadow-sm transition-transform duration-150 hover:scale-105"
                        onClick={(event) => {
                            event.preventDefault();
                            router.delete(route('account.wishlist.destroy', item.id), { preserveScroll: true });
                        }}
                    >
                        <Heart className="h-4 w-4 fill-current" />
                    </button>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
                <p className={`mb-1 text-sm ${hasComparePrice ? 'text-[var(--cbx-accent-crimson)]' : 'text-[var(--cbx-neutral-mid)]'}`}>
                    {hasComparePrice ? 'SALE' : eyebrow}
                </p>
                <Link href={route('products.show', product.slug)} className="mb-2 text-base font-semibold text-[var(--cbx-primary)] transition-colors hover:text-[var(--cbx-secondary)]">
                    {product.name}
                </Link>

                <div className="mt-auto">
                    {hasComparePrice ? (
                        <div className="mb-4 flex items-center gap-3">
                            <span className="font-heading text-[1.25rem] font-bold text-[var(--cbx-secondary)]">{formatCurrency(currentPrice)}</span>
                            <span className="text-sm text-[var(--cbx-neutral-mid)] line-through">{formatCurrency(comparePrice)}</span>
                        </div>
                    ) : (
                        <span className="mb-4 block font-heading text-[1.25rem] font-bold text-[var(--cbx-primary)]">{formatCurrency(currentPrice)}</span>
                    )}

                    <Button
                        className="w-full justify-center rounded-none px-4 py-3 text-xs font-bold uppercase tracking-[0.14em]"
                        disabled={!firstVariant?.id}
                        onClick={() => router.post(route('cart.store'), { variant_id: firstVariant.id, quantity: 1 }, { preserveScroll: true })}
                    >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to bag
                    </Button>
                </div>
            </div>
        </article>
    );
}

export default function Wishlist({ items }) {
    return (
        <StorefrontLayout title="Wishlist">
            <section className="space-y-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <nav className="mb-2 flex items-center gap-2 text-sm text-[var(--cbx-neutral-mid)]">
                            <Link href={route('home')} className="transition-colors hover:text-[var(--cbx-primary)]">Home</Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="font-semibold text-[var(--cbx-primary)]">Wishlist</span>
                        </nav>
                        <h1 className="font-heading text-4xl font-black tracking-[-0.04em] text-[var(--cbx-primary)] sm:text-5xl">
                            My Wishlist
                        </h1>
                        <p className="mt-2 text-base text-[var(--cbx-on-surface-variant)]">
                            Manage your favorite items and find them later.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm text-[var(--cbx-neutral-mid)]">{items.length} {items.length === 1 ? 'Item Saved' : 'Items Saved'}</span>
                        <button
                            type="button"
                            className="flex items-center gap-2 border border-[var(--cbx-outline)] px-4 py-2 text-sm text-[var(--cbx-on-surface)] transition-colors hover:bg-[var(--cbx-neutral-light)]"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Sort by: Newest
                        </button>
                    </div>
                </div>

                {items.length ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {items.map((item) => <WishlistCard key={item.id} item={item} />)}
                    </div>
                ) : (
                    <div className="border border-[var(--cbx-border-subtle)] bg-white p-8 sm:p-10">
                        <p className="text-sm uppercase tracking-[0.14em] text-[var(--cbx-neutral-mid)]">Wishlist</p>
                        <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] text-[var(--cbx-primary)]">Nothing saved yet</h2>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] sm:text-base">
                            Explore new arrivals, accessories, and best sellers to start building your shortlist.
                        </p>
                        <Button className="mt-6 px-6 py-3" onClick={() => router.visit(route('shop.index'))}>
                            Browse products
                        </Button>
                    </div>
                )}

                <section className="bg-[var(--cbx-primary)] px-6 py-12 text-center text-[var(--cbx-on-primary)] sm:px-8 md:py-14">
                    <h2 className="font-heading text-4xl text-white/80 uppercase tracking-[-0.03em]">Want it all?</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/80">
                        Check out our latest collections and get inspired by this season&apos;s hottest trends.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                        <Button className="min-w-48 bg-white px-8 py-4 text-[var(--cbx-primary)] hover:bg-[var(--cbx-surface-container-highest)]" onClick={() => router.visit(route('collections.show', 'new-arrivals'))}>
                            Shop new arrivals
                        </Button>
                        <Button variant="secondary" className="min-w-48 border border-white bg-transparent px-8 py-4 text-white hover:bg-white/10" onClick={() => router.visit(route('shop.index'))}>
                            View best sellers
                        </Button>
                    </div>
                </section>
            </section>
        </StorefrontLayout>
    );
}
