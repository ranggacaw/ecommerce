import ProductCard from '@/Components/ProductCard';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Link } from '@inertiajs/react';

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

    return (
        <StorefrontLayout title="Home" categories={categories}>
            <section className="grid gap-6 lg:grid-cols-[55fr_45fr]">
                <Card className="overflow-hidden">
                    {banners?.[0] ? (
                        <div className="grid min-h-[520px] lg:grid-cols-[30fr_70fr]">
                            <div className="flex flex-col justify-between p-8 lg:p-10">
                                <div className="space-y-5">
                                    <Badge className="border-[var(--cbx-brand-light-pink)] bg-[var(--cbx-brand-light-pink)] text-[var(--cbx-accent-crimson)]">Season Campaign</Badge>
                                    <h1 className="max-w-md font-heading text-4xl font-bold leading-[1.05] tracking-[-0.02em] lg:text-6xl">
                                        {banners[0].title}
                                    </h1>
                                    <p className="max-w-md text-base leading-7 text-[var(--cbx-on-surface-variant)]">{banners[0].subtitle}</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Link href={banners[0].cta_href || route('shop.index')}>
                                        <Button size="lg">{banners[0].cta_label || 'Shop now'}</Button>
                                    </Link>
                                    <Link href={route('collections.show', 'new-arrivals')}>
                                        <Button variant="secondary" size="lg">New arrivals</Button>
                                    </Link>
                                </div>
                            </div>
                            <img src={banners[0].image_url} alt={banners[0].title} className="h-full w-full object-cover" />
                        </div>
                    ) : null}
                </Card>

                <div className="grid gap-6">
                    {banners?.slice(1, 3).map((banner) => (
                        <Card key={banner.id} className="overflow-hidden">
                            <div className="grid md:grid-cols-[1fr_1.1fr]">
                                <CardContent className="space-y-4">
                                    <Badge>{banner.cta_label || 'Curated edit'}</Badge>
                                    <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">{banner.title}</h2>
                                    <p className="text-sm leading-6 text-[var(--cbx-on-surface-variant)]">{banner.subtitle}</p>
                                    <Link href={banner.cta_href || route('shop.index')} className="inline-flex text-sm font-semibold text-[var(--cbx-secondary)]">
                                        Explore collection
                                    </Link>
                                </CardContent>
                                <img src={banner.image_url} alt={banner.title} className="h-60 w-full object-cover" />
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {promoCollection ? (
                <section className="space-y-6">
                    <div className="flex flex-col gap-4 rounded-xl bg-[var(--cbx-primary-container)] p-6 text-white lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <Badge className="border-[var(--cbx-secondary-container)] bg-[var(--cbx-secondary)] text-white">Flash Sale</Badge>
                            <h2 className="mt-4 font-heading text-3xl font-semibold text-white">{promoCollection.name}</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">{promoCollection.description}</p>
                        </div>
                        <div className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-[var(--cbx-primary)]">Limited-time pricing</div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {promoCollection.products?.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                </section>
            ) : null}

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="cbx-kicker">Shop by Category</p>
                        <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Browse by wardrobe role</h2>
                    </div>
                    <Link href={route('shop.index')} className="text-sm font-semibold text-[var(--cbx-secondary)]">View all products</Link>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    {categories.map((category, index) => (
                        <Link key={category.id} href={route('categories.show', category.slug)}>
                            <Card className="h-full overflow-hidden">
                                <div className={`flex aspect-[4/3] items-end bg-gradient-to-br ${categoryAccents[index % categoryAccents.length]} p-6`}>
                                    <span className="font-heading text-5xl font-bold text-[var(--cbx-neutral-dark)]/50">{category.name.slice(0, 1)}</span>
                                </div>
                                <CardContent className="space-y-4">
                                    <Badge>{category.type || 'Category'}</Badge>
                                    <h3 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">{category.name}</h3>
                                    <p className="text-sm leading-6 text-[var(--cbx-on-surface-variant)]">{category.description}</p>
                                    <span className="inline-flex text-sm font-semibold text-[var(--cbx-secondary)]">Lihat Koleksi</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {newArrivals ? (
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="cbx-kicker">{newArrivals.name}</p>
                            <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Fresh silhouettes for this week</h2>
                        </div>
                        <Link href={route('collections.show', newArrivals.slug)} className="text-sm font-semibold text-[var(--cbx-secondary)]">Open collection</Link>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {newArrivals.products?.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                </section>
            ) : null}

            <section className="space-y-6">
                <div>
                    <p className="cbx-kicker">Trending</p>
                    <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Storefront bestsellers</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[30fr_70fr]">
                <Card>
                    <CardContent className="space-y-4 p-8">
                        <p className="cbx-kicker">Instagram</p>
                        <h2 className="font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Follow the COLORBOX feed.</h2>
                        <p className="text-sm leading-6 text-[var(--cbx-on-surface-variant)]">Editorial lifestyle moments keep the storefront from feeling purely transactional.</p>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="cbx-button cbx-button-secondary px-5 py-3 text-sm">@colorbox</a>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {socialImages.map((image, index) => (
                        <Card key={`${image}-${index}`} className="overflow-hidden">
                            <img src={image} alt={`Colorbox editorial ${index + 1}`} className="aspect-square h-full w-full object-cover" />
                        </Card>
                    ))}
                </div>
            </section>
        </StorefrontLayout>
    );
}
