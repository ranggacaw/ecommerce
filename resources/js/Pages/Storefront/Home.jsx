import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { formatCurrency, productPrimaryImage, productPrice } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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

function HeroSlideshow({ banners }) {
    const heroBanners = banners || [];
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const activeBanner = heroBanners[activeBannerIndex] || null;

    useEffect(() => {
        if (!heroBanners.length) {
            return;
        }
        setActiveBannerIndex((currentIndex) => Math.min(currentIndex, heroBanners.length - 1));
    }, [heroBanners.length]);

    useEffect(() => {
        if (heroBanners.length < 2) {
            return;
        }
        const intervalId = window.setInterval(() => {
            setActiveBannerIndex((currentIndex) => (currentIndex + 1) % heroBanners.length);
        }, 6000);
        return () => window.clearInterval(intervalId);
    }, [heroBanners.length]);

    const showPreviousBanner = () => {
        setActiveBannerIndex((currentIndex) => (currentIndex - 1 + heroBanners.length) % heroBanners.length);
    };

    const showNextBanner = () => {
        setActiveBannerIndex((currentIndex) => (currentIndex + 1) % heroBanners.length);
    };

    if (!activeBanner) {
        return null;
    }

    return (
        <section className="relative w-full overflow-hidden" style={{ height: '70vh' }}>
            <div className="absolute inset-0 z-0">
                {heroBanners.map((banner, index) => {
                    const fallbackImages = [
                        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&h=900&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop&q=80'
                    ];
                    return (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-700 ${index === activeBannerIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img src={banner.image_url || fallbackImages[index % fallbackImages.length]} alt={banner.title} className="h-full w-full object-cover" />
                        </div>
                    );
                })}
            </div>
            <div className="absolute inset-0 z-10 bg-black/10" />

            <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-[4%]">
                <div className="max-w-xl">
                    <Badge className="mb-6 border-white/25 bg-[var(--cbx-secondary)] text-white backdrop-blur uppercase tracking-widest text-[11px] font-bold px-3 py-1">{activeBanner.cta_label || 'Limited Edition'}</Badge>
                    <h1 className="mb-6 font-heading text-5xl font-black uppercase leading-[1.1] tracking-[-0.02em] text-white lg:text-7xl">
                        {activeBanner.title?.split(' ').map((word, i, arr) => (
                            <span key={i}>{word}{i < arr.length - 1 ? <br /> : null}</span>
                        ))}
                    </h1>
                    <p className="mb-8 max-w-md text-base leading-7 text-white/90 lg:text-lg">{activeBanner.subtitle}</p>
                    <div className="flex flex-wrap gap-4">
                        <Link href={activeBanner.cta_href || route('shop.index')}>
                            <Button size="lg" className="bg-white text-[var(--cbx-primary)] hover:bg-gray-100 uppercase tracking-widest text-xs px-10 py-4 font-semibold">Shop Now</Button>
                        </Link>
                        <Link href={route('collections.show', 'new-arrivals')}>
                            <Button variant="secondary" size="lg" className="border-white/60 bg-white/10 text-white hover:border-white hover:bg-white/15 hover:text-white uppercase tracking-widest text-xs px-10 py-4 font-semibold">Explore All</Button>
                        </Link>
                    </div>
                </div>
            </div>

            {heroBanners.length > 1 && (
                <>
                    <div className="absolute bottom-8 left-[4%] z-20 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={showPreviousBanner}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={showNextBanner}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="absolute bottom-8 right-[4%] z-20 flex gap-2">
                        {heroBanners.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setActiveBannerIndex(index)}
                                className={`h-1 transition-all ${index === activeBannerIndex ? 'w-12 bg-white' : 'w-8 bg-white/40 hover:bg-white/60'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default function Home({ banners, categories, newArrivals, promoCollection, featuredProducts }) {
    const categoryAccents = [
        'from-[var(--cbx-brand-light-pink)] to-white',
        'from-[var(--cbx-neutral-light)] to-white',
        'from-[var(--cbx-secondary-container)]/20 to-white',
    ];
    const heroBanners = banners || [];
    const socialImages = [
        ...heroBanners.map((banner) => banner.image_url),
        ...(featuredProducts || []).flatMap((product) => product.images?.map((image) => image.url) || []),
    ].filter(Boolean).slice(0, 4);
    const categoryVisuals = categories.slice(0, 3).map((category, index) => category.image_url || socialImages[index] || banners?.[index + 1]?.image_url || banners?.[0]?.image_url || null);
    const categoryTiles = categories.slice(0, 3);

    return (
        <StorefrontLayout title="Home" categories={categories}>
            <HeroSlideshow banners={banners} />

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
