import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { formatCurrency, productPrimaryImage, productPrice } from '@/lib/utils';
import { Link } from '@inertiajs/react';

function ProductTile({ product }) {
    return (
        <article className="group">
            <Link href={route('products.show', product.slug)} className="block overflow-hidden rounded-[1.5rem] border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] shadow-[var(--cbx-shadow-soft)]">
                <img src={productPrimaryImage(product)} alt={product.name} className="aspect-[3/4] h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
            </Link>
            <div className="mt-4 space-y-1">
                <p className="text-xs text-[var(--cbx-neutral-mid)]">{product.is_new_arrival ? 'New drop' : product.category?.name || 'Featured'}</p>
                <Link href={route('products.show', product.slug)} className="font-heading text-lg font-semibold text-[var(--cbx-on-surface)] hover:text-[var(--cbx-secondary)]">
                    {product.name}
                </Link>
                <p className="font-heading text-lg font-bold text-[var(--cbx-primary)]">{formatCurrency(productPrice(product))}</p>
            </div>
        </article>
    );
}

export default function Home({ banners, categories, newArrivals, promoCollection, featuredProducts }) {
    const categoryAccents = [
        'from-[var(--cbx-brand-light-pink)] to-white',
        'from-[var(--cbx-neutral-light)] to-white',
        'from-[var(--cbx-secondary-container)]/20 to-white',
    ];
    const socialImages = [
        ...(banners || []).map((banner) => banner.image_url),
        ...(featuredProducts || []).flatMap((product) => product.images?.map((image) => image.url) || []),
    ].filter(Boolean).slice(0, 4);
    const categoryVisuals = categories.slice(0, 3).map((category, index) => category.image_url || socialImages[index] || banners?.[index + 1]?.image_url || banners?.[0]?.image_url || null);
    const categoryTiles = categories.slice(0, 3);

    return (
        <StorefrontLayout title="Home" categories={categories}>
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_20rem]">
                {banners?.[0] ? (
                    <div className="relative isolate flex min-h-[36rem] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-[var(--cbx-border-subtle)] bg-[var(--cbx-primary-container)] p-8 text-white shadow-[var(--cbx-shadow-soft)] lg:min-h-[41rem] lg:p-12">
                        <img src={banners[0].image_url} alt={banners[0].title} className="absolute inset-0 -z-20 h-full w-full object-cover" />
                        <div className="absolute inset-0 -z-10 bg-[linear-gradient(140deg,rgba(0,0,0,0.18),rgba(0,0,0,0.08)_32%,rgba(0,0,0,0.62))]" />
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_34%)]" />

                        <div className="max-w-xl space-y-6">
                            <Badge className="w-fit border-white/25 bg-white/10 text-white backdrop-blur">Season Campaign</Badge>
                            <div className="space-y-4">
                                <p className="cbx-kicker text-white/70">Spring campaign</p>
                                <h1 className="max-w-md font-heading text-5xl font-black leading-[0.92] tracking-[-0.04em] lg:text-7xl">
                                    {banners[0].title}
                                </h1>
                                <p className="max-w-md text-sm leading-7 text-white/80 lg:text-base">{banners[0].subtitle}</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href={banners[0].cta_href || route('shop.index')}>
                                    <Button size="lg" className="bg-white text-[var(--cbx-primary)] hover:bg-[var(--cbx-surface-container-low)]">{banners[0].cta_label || 'Shop now'}</Button>
                                </Link>
                                <Link href={route('collections.show', 'new-arrivals')}>
                                    <Button variant="secondary" size="lg" className="border-white/60 bg-white/10 text-white hover:border-white hover:bg-white/15 hover:text-white">Explore all</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="grid gap-4">
                    <Card className="bg-[linear-gradient(180deg,var(--cbx-surface-container-lowest),var(--cbx-surface-container-low))]">
                        <CardContent className="space-y-4 p-5">
                            <p className="cbx-kicker">Style Direction</p>
                            <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-[var(--cbx-on-surface)]">Sharper hierarchy, less clutter</h2>
                            <p className="text-sm leading-6 text-[var(--cbx-on-surface-variant)]">A stronger hero leads the storefront, while promo and discovery content move into cleaner, more deliberate sections.</p>
                        </CardContent>
                    </Card>

                    {banners?.slice(1, 3).map((banner) => (
                        <Card key={banner.id} className="overflow-hidden">
                            <div className="h-40 w-full bg-[var(--cbx-surface-container-low)]">
                                <img src={banner.image_url} alt={banner.title} className="h-full w-full object-cover" />
                            </div>
                            <CardContent className="space-y-3 p-5">
                                <Badge>{banner.cta_label || 'Curated edit'}</Badge>
                                <h2 className="font-heading text-xl font-semibold text-[var(--cbx-on-surface)]">{banner.title}</h2>
                                <p className="text-sm leading-6 text-[var(--cbx-on-surface-variant)]">{banner.subtitle}</p>
                                <Link href={banner.cta_href || route('shop.index')} className="inline-flex text-sm font-semibold text-[var(--cbx-secondary)]">
                                    Explore collection
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--cbx-border-subtle)] bg-[var(--cbx-border-subtle)] lg:grid-cols-3">
                <div className="bg-[var(--cbx-surface-container-lowest)] px-6 py-6">
                    <p className="cbx-kicker">New In Weekly</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--cbx-on-surface-variant)]">Rotating drops and curated edits get their own lane beneath the hero instead of competing above the fold.</p>
                </div>
                <div className="bg-[var(--cbx-surface-container-lowest)] px-6 py-6">
                    <p className="cbx-kicker">Delivery & Pickup</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--cbx-on-surface-variant)]">Short, useful reassurance replaces scattered utility content throughout the homepage.</p>
                </div>
                <div className="bg-[var(--cbx-surface-container-lowest)] px-6 py-6">
                    <p className="cbx-kicker">Member Perks</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--cbx-on-surface-variant)]">Wishlist, account, and campaign hooks still surface without overcrowding the hero.</p>
                </div>
            </section>

            {promoCollection ? (
                <section className="space-y-6">
                    <div className="grid gap-6 rounded-[1.75rem] border border-[var(--cbx-secondary)] bg-[linear-gradient(135deg,var(--cbx-secondary-container),var(--cbx-secondary))] p-6 text-white shadow-[var(--cbx-shadow-soft)] lg:grid-cols-[1fr_auto_auto] lg:items-center lg:px-8 lg:py-8">
                        <div>
                            <Badge className="border-white/10 bg-black/10 text-white backdrop-blur">Flash Sale</Badge>
                            <h2 className="mt-4 font-heading text-3xl font-black tracking-[-0.03em] text-white lg:text-4xl">{promoCollection.name}</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">{promoCollection.description}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur">
                                <div className="font-heading text-2xl font-bold">02</div>
                                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/75">Hours</div>
                            </div>
                            <div className="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur">
                                <div className="font-heading text-2xl font-bold">45</div>
                                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/75">Mins</div>
                            </div>
                            <div className="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur">
                                <div className="font-heading text-2xl font-bold">12</div>
                                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/75">Secs</div>
                            </div>
                        </div>
                        <div className="rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white">Limited-time pricing</div>
                    </div>
                </section>
            ) : null}

            <section className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="cbx-kicker">Shop by Category</p>
                        <h2 className="mt-2 font-heading text-3xl font-black tracking-[-0.04em] text-[var(--cbx-on-surface)] lg:text-5xl">Asymmetric discovery</h2>
                    </div>
                    <Link href={route('shop.index')} className="text-sm font-semibold text-[var(--cbx-secondary)]">View all products</Link>
                </div>
                <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-6">
                    {categoryTiles.map((category, index) => {
                        const isPrimary = index === 0;
                        const visual = categoryVisuals[index];

                        return (
                            <Link
                                key={category.id}
                                href={route('categories.show', category.slug)}
                                className={isPrimary ? 'md:col-span-7 md:row-span-2' : 'md:col-span-5'}
                            >
                                <article className={`relative flex min-h-[16rem] overflow-hidden rounded-[1.75rem] border border-[var(--cbx-border-subtle)] p-6 text-white shadow-[var(--cbx-shadow-soft)] ${isPrimary ? 'lg:min-h-[35rem] lg:p-10' : ''}`}>
                                    {visual ? <img src={visual} alt={category.name} className="absolute inset-0 h-full w-full object-cover" /> : null}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${categoryAccents[index % categoryAccents.length]}`} />
                                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),rgba(0,0,0,0.08))]" />

                                    <div className="relative mt-auto max-w-sm space-y-3">
                                        <p className="cbx-kicker text-white/70">{category.type || 'Category'}</p>
                                        <h3 className={`${isPrimary ? 'text-4xl lg:text-5xl' : 'text-3xl'} font-heading font-black leading-[0.95] tracking-[-0.03em]`}>
                                            {isPrimary ? `The New Uniform: ${category.name}` : category.name}
                                        </h3>
                                        <p className="max-w-xs text-sm leading-6 text-white/80">{category.description}</p>
                                        <span className="inline-flex rounded-md bg-white px-4 py-3 text-sm font-semibold text-[var(--cbx-primary)]">Lihat Koleksi</span>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {newArrivals ? (
                <section className="space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="cbx-kicker">{newArrivals.name}</p>
                            <h2 className="mt-3 font-heading text-3xl font-black tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-4xl">Fresh silhouettes for this week</h2>
                        </div>
                        <Link href={route('collections.show', newArrivals.slug)} className="text-sm font-semibold text-[var(--cbx-secondary)]">Open collection</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                        {newArrivals.products?.slice(0, 4).map((product) => <ProductTile key={product.id} product={product} />)}
                    </div>
                </section>
            ) : null}

            <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
                <Card className="bg-[linear-gradient(180deg,var(--cbx-surface-container-lowest),var(--cbx-surface-container-low))]">
                    <CardContent className="space-y-5 p-8">
                        <p className="cbx-kicker">Editorial / Community</p>
                        <h2 className="font-heading text-3xl font-black tracking-[-0.03em] text-[var(--cbx-on-surface)]">Follow the COLORBOX feed.</h2>
                        <p className="max-w-md text-sm leading-6 text-[var(--cbx-on-surface-variant)]">The social block becomes a real brand moment, not just a leftover gallery at the bottom of the page.</p>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="cbx-button cbx-button-secondary w-fit px-5 py-3 text-sm">@colorbox</a>
                        <div className="grid grid-cols-2 gap-3">
                            {socialImages.map((image, index) => (
                                <Card key={`${image}-${index}`} className="overflow-hidden border-none shadow-none">
                                    <img src={image} alt={`Colorbox editorial ${index + 1}`} className="aspect-square h-full w-full object-cover" />
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="cbx-kicker">Trending</p>
                            <h2 className="mt-2 font-heading text-3xl font-black tracking-[-0.03em] text-[var(--cbx-on-surface)] lg:text-4xl">Storefront bestsellers</h2>
                        </div>
                        <Link href={route('shop.index')} className="text-sm font-semibold text-[var(--cbx-secondary)]">View all products</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 xl:gap-5">
                        {featuredProducts.map((product) => <ProductTile key={product.id} product={product} />)}
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
