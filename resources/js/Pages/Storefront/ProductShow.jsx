import ProductCard from '@/Components/ProductCard';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { formatCurrency, productPrimaryImage } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ProductShow({ product, relatedProducts }) {
    const { auth } = usePage().props;
    const [selectedImage, setSelectedImage] = useState(productPrimaryImage(product));
    const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id);

    const selectedVariant = useMemo(() => product.variants?.find((variant) => variant.id === selectedVariantId) || product.variants?.[0], [product.variants, selectedVariantId]);

    const addToCart = () => {
        if (!selectedVariant) {
            return;
        }

        router.post(route('cart.store'), { variant_id: selectedVariant.id, quantity: 1 });
    };

    const saveWishlist = () => {
        router.post(route('account.wishlist.store'), { product_id: product.id });
    };

    return (
        <StorefrontLayout title={product.name} categories={[product.category].filter(Boolean)}>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                    <img src={selectedImage} alt={product.name} className="h-[640px] w-full rounded-xl border border-[var(--cbx-border-subtle)] object-cover" />
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {product.images?.map((image) => (
                            <button key={image.id} type="button" onClick={() => setSelectedImage(image.url)} className={`overflow-hidden rounded-xl border ${selectedImage === image.url ? 'border-[var(--cbx-primary)]' : 'border-[var(--cbx-border-subtle)]'}`}>
                                <img src={image.url} alt={image.alt} className="h-32 w-full object-cover transition hover:scale-105" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge>{product.category?.name}</Badge>
                            {product.is_new_arrival ? <Badge className="border-[var(--cbx-brand-light-pink)] bg-[var(--cbx-brand-light-pink)] text-[var(--cbx-accent-crimson)]">New Arrival</Badge> : null}
                            {product.is_promoted ? <Badge className="border-[var(--cbx-secondary-container)] bg-[var(--cbx-secondary-container)] text-white">Promo</Badge> : null}
                        </div>
                        <h1 className="font-heading text-4xl font-semibold text-[var(--cbx-on-surface)]">{product.name}</h1>
                        <p className="cbx-price text-2xl">{formatCurrency(selectedVariant?.price || product.base_price)}</p>
                        <p className="max-w-xl text-sm leading-7 text-[var(--cbx-on-surface-variant)]">{product.description}</p>
                    </div>

                    <Card>
                        <CardContent className="space-y-5">
                            <div>
                                <p className="cbx-kicker">Variant</p>
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {product.variants?.map((variant) => (
                                        <button
                                            key={variant.id}
                                            type="button"
                                            onClick={() => setSelectedVariantId(variant.id)}
                                            className={`rounded-md border px-4 py-3 text-sm font-medium ${selectedVariantId === variant.id ? 'border-[var(--cbx-primary)] bg-[var(--cbx-primary)] text-white' : 'border-[var(--cbx-outline-variant)] text-[var(--cbx-on-surface-variant)]'}`}
                                        >
                                            {variant.display_name} · {variant.available_stock} left
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <Button onClick={addToCart} size="lg" disabled={!selectedVariant || selectedVariant.available_stock < 1}>Add to bag</Button>
                                {auth.user ? (
                                    <Button onClick={saveWishlist} variant="secondary" size="lg"><Heart className="mr-2 h-4 w-4" />Save to wishlist</Button>
                                ) : (
                                    <Link href={route('login')} className="inline-flex">
                                        <Button variant="secondary" size="lg" type="button"><Heart className="mr-2 h-4 w-4" />Sign in to save</Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardContent>
                                <p className="cbx-kicker">Material</p>
                                <p className="mt-3 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">{product.material || 'Material details will be added by the merchandising team.'}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <p className="cbx-kicker">Size chart</p>
                                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--cbx-on-surface-variant)]">{product.size_chart || 'Size guidance will be published soon.'}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="cbx-kicker">Upsell</p>
                        <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Related pieces</h2>
                    </div>
                    <Link href={route('categories.show', product.category?.slug)} className="text-sm font-semibold text-[var(--cbx-secondary)]">Browse category</Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {relatedProducts.map((related) => <ProductCard key={related.id} product={related} />)}
                </div>
            </section>
        </StorefrontLayout>
    );
}
