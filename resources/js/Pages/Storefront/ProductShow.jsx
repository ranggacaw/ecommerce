import ProductCard from '@/Components/ProductCard';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { formatCurrency, productPrimaryImage, productPrice } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ProductShow({ product, relatedProducts }) {
    const { auth } = usePage().props;
    const [selectedImage, setSelectedImage] = useState(productPrimaryImage(product));
    const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id);
    const [openAccordions, setOpenAccordions] = useState(['description']);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);

    const selectedVariant = useMemo(() => product.variants?.find((variant) => variant.id === selectedVariantId) || product.variants?.[0], [product.variants, selectedVariantId]);

    const currentPrice = Number(productPrice(product, selectedVariant));
    const comparePrice = Number(selectedVariant?.compare_price || product.compare_price || 0);
    const hasComparePrice = comparePrice > currentPrice;
    const discountPercent = hasComparePrice ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0;

    const colorVariants = useMemo(() => {
        const map = new Map();
        product.variants?.forEach((v) => {
            if (v.color && !map.has(v.color)) {
                map.set(v.color, v);
            }
        });
        return Array.from(map.values());
    }, [product.variants]);

    const handleColorSelect = (variant) => {
        const colorSizes = product.variants?.filter((v) => v.color === variant.color && v.available_stock > 0);
        if (colorSizes?.length > 0) {
            const inStock = colorSizes.find((v) => v.id === selectedVariantId) || colorSizes[0];
            setSelectedVariantId(inStock.id);
        } else {
            setSelectedVariantId(variant.id);
        }
    };

    const handleSizeSelect = (variant) => {
        if (variant.available_stock < 1) return;
        setSelectedVariantId(variant.id);
    };

    const addToCart = () => {
        if (!selectedVariant || selectedVariant.available_stock < 1) {
            return;
        }
        router.post(route('cart.store'), { variant_id: selectedVariant.id, quantity: 1 });
    };

    const saveWishlist = () => {
        router.post(route('account.wishlist.store'), { product_id: product.id });
    };

    const quickAddToCart = (relatedProduct) => {
        const firstAvailable = relatedProduct.variants?.find((v) => v.available_stock > 0) || relatedProduct.variants?.[0];
        if (!firstAvailable) return;
        router.post(route('cart.store'), { variant_id: firstAvailable.id, quantity: 1 });
    };

    const toggleAccordion = (key) => {
        setOpenAccordions((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
    };

    const kickerLabel = product.is_new_arrival ? 'New Arrival' : product.is_promoted ? 'Promo' : product.category?.name || '';

    const breadcrumbs = [
        { label: 'Home', href: route('home') },
        { label: product.category?.name || 'Shop', href: product.category ? route('categories.show', product.category.slug) : route('shop.index') },
        { label: product.name },
    ];

    return (
        <StorefrontLayout title={product.name} categories={[product.category].filter(Boolean)}>
            <nav className="flex flex-wrap gap-2 text-sm text-[var(--cbx-on-surface-variant)]">
                {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="flex items-center gap-2">
                        {index > 0 && <span>/</span>}
                        {crumb.href ? (
                            <Link href={crumb.href} className="hover:text-[var(--cbx-primary)] transition-colors">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="font-semibold text-[var(--cbx-on-surface)]">{crumb.label}</span>
                        )}
                    </span>
                ))}
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2 hidden lg:flex flex-col gap-4">
                            {product.images?.map((image, index) => (
                                <button
                                    key={image.id}
                                    type="button"
                                    onClick={() => setSelectedImage(image.url)}
                                    className={`aspect-[3/4] overflow-hidden rounded-lg transition-all ${selectedImage === image.url ? 'border-2 border-[var(--cbx-primary)]' : 'border border-[var(--cbx-border-subtle)] opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={image.url} alt={image.alt || product.name} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="col-span-12 lg:col-span-10">
                            <div className="aspect-[3/4] w-full relative overflow-hidden group cursor-zoom-in" onClick={() => setShowLightbox(true)}>
                                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setShowLightbox(true); }}>
                                    <svg className="w-5 h-5 text-[var(--cbx-on-surface)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                        <path d="M11 8v6M8 11h6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {kickerLabel && <Badge>{kickerLabel}</Badge>}
                            {product.is_new_arrival && <Badge className="border-[var(--cbx-brand-light-pink)] bg-[var(--cbx-brand-light-pink)] text-[var(--cbx-accent-crimson)]">New Arrival</Badge>}
                            {product.is_promoted && <Badge className="border-[var(--cbx-secondary-container)] bg-[var(--cbx-secondary-container)] text-white">Promo</Badge>}
                        </div>
                        <h1 className="font-heading text-3xl font-semibold text-[var(--cbx-on-surface)] lg:text-4xl">{product.name}</h1>
                        {product.sku && <p className="text-sm text-[var(--cbx-on-surface-variant)]">SKU: {product.sku}</p>}
                        <div className="flex items-baseline gap-4 flex-wrap">
                            <span className="cbx-price">{formatCurrency(currentPrice)}</span>
                            {hasComparePrice && (
                                <>
                                    <span className="text-base text-[var(--cbx-on-surface-variant)] line-through">{formatCurrency(comparePrice)}</span>
                                    <span className="bg-[var(--cbx-secondary-container)] text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded">{discountPercent}% Off</span>
                                </>
                            )}
                        </div>
                    </div>

                    <Card className="p-5">
                        <CardContent className="space-y-5 p-0">
                            {colorVariants.length > 0 && (
                                <div>
                                    <p className="cbx-kicker">Select Color</p>
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        {colorVariants.map((colorVariant) => (
                                            <button
                                                key={colorVariant.id}
                                                type="button"
                                                onClick={() => handleColorSelect(colorVariant)}
                                                className={`w-10 h-10 rounded-full transition-all ${selectedVariant?.color === colorVariant.color ? 'ring-2 ring-offset-2 ring-[var(--cbx-primary)]' : 'ring-1 ring-[var(--cbx-border-subtle)] hover:ring-[var(--cbx-primary)]'}`}
                                                style={{ backgroundColor: colorVariant.color || '#000000' }}
                                                aria-label={`Select ${colorVariant.color || 'color'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <p className="cbx-kicker">Select Size</p>
                                    <button onClick={() => setShowSizeGuide(true)} className="text-xs font-bold underline hover:text-[var(--cbx-secondary)] transition-colors">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {product.variants?.map((variant) => {
                                        const isSelected = selectedVariantId === variant.id;
                                        const isOutOfStock = variant.available_stock < 1;
                                        return (
                                            <button
                                                key={variant.id}
                                                type="button"
                                                onClick={() => handleSizeSelect(variant)}
                                                disabled={isOutOfStock}
                                                className={`h-12 border text-sm transition-all ${isSelected ? 'border-[var(--cbx-primary)] border-2 font-bold bg-[var(--cbx-surface-container-high)]' : 'border-[var(--cbx-border-subtle)] hover:border-[var(--cbx-primary)]'} ${isOutOfStock ? 'opacity-40 cursor-not-allowed bg-[var(--cbx-neutral-light)]' : ''}`}
                                            >
                                                {variant.size || variant.display_name?.split(' · ')[0] || 'M'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <Button onClick={addToCart} size="lg" disabled={!selectedVariant || selectedVariant.available_stock < 1} className="gap-2">
                                    <ShoppingBag className="h-4 w-4" />
                                    Add to Bag
                                </Button>
                                {auth.user ? (
                                    <Button onClick={saveWishlist} variant="secondary" size="lg" className="gap-2">
                                        <Heart className="h-4 w-4" />
                                        Save to Wishlist
                                    </Button>
                                ) : (
                                    <Link href={route('login')} className="inline-flex">
                                        <Button variant="secondary" size="lg" type="button" className="gap-2">
                                            <Heart className="h-4 w-4" />
                                            Sign in to Save
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="border-t border-[var(--cbx-border-subtle)]">
                        <div className="border-b border-[var(--cbx-border-subtle)]">
                            <button
                                type="button"
                                onClick={() => toggleAccordion('description')}
                                className="w-full py-4 flex justify-between items-center hover:bg-[var(--cbx-surface-container-low)] transition-colors"
                            >
                                <span className="cbx-kicker">Description</span>
                                <svg className={`w-5 h-5 text-[var(--cbx-outline)] transition-transform duration-300 ${openAccordions.includes('description') ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                            {openAccordions.includes('description') && (
                                <div className="pb-4 text-sm text-[var(--cbx-on-surface-variant)] leading-relaxed">
                                    {product.description || 'No description available.'}
                                </div>
                            )}
                        </div>
                        <div className="border-b border-[var(--cbx-border-subtle)]">
                            <button
                                type="button"
                                onClick={() => toggleAccordion('material')}
                                className="w-full py-4 flex justify-between items-center hover:bg-[var(--cbx-surface-container-low)] transition-colors"
                            >
                                <span className="cbx-kicker">Composition &amp; Care</span>
                                <svg className={`w-5 h-5 text-[var(--cbx-outline)] transition-transform duration-300 ${openAccordions.includes('material') ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                            {openAccordions.includes('material') && (
                                <div className="pb-4 text-sm text-[var(--cbx-on-surface-variant)] leading-relaxed">
                                    {product.material || 'Material details will be added by the merchandising team.'}
                                </div>
                            )}
                        </div>
                        <div className="border-b border-[var(--cbx-border-subtle)]">
                            <button
                                type="button"
                                onClick={() => toggleAccordion('shipping')}
                                className="w-full py-4 flex justify-between items-center hover:bg-[var(--cbx-surface-container-low)] transition-colors"
                            >
                                <span className="cbx-kicker">Shipping &amp; Returns</span>
                                <svg className={`w-5 h-5 text-[var(--cbx-outline)] transition-transform duration-300 ${openAccordions.includes('shipping') ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                            {openAccordions.includes('shipping') && (
                                <div className="pb-4 text-sm text-[var(--cbx-on-surface-variant)] leading-relaxed">
                                    Free shipping on orders over IDR 500,000. Standard delivery 2-3 business days. Returns accepted within 14 days of delivery.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[var(--cbx-surface-container-low)] p-4 rounded-lg flex gap-4 items-start">
                        <svg className="w-6 h-6 text-[var(--cbx-accent-forest)] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16.5 10.5V17a4 4 0 01-8 0v-6.5" />
                            <path d="M3 10h18v7a4 4 0 01-4 4H7a4 4 0 01-4-4v-7z" />
                            <path d="M8 10V6a4 4 0 018 0v4" />
                        </svg>
                        <div>
                            <p className="text-sm font-bold text-[var(--cbx-on-surface)]">Free Shipping to Jakarta</p>
                            <p className="text-sm text-[var(--cbx-on-surface-variant)]">Estimated arrival: 2-3 business days.</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="cbx-kicker">Upsell</p>
                        <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)] lg:text-3xl">Related pieces</h2>
                    </div>
                    <Link href={route('categories.show', product.category?.slug)} className="text-sm font-semibold text-[var(--cbx-secondary)] hover:underline transition-all">
                        Browse category
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
                    {relatedProducts.map((related) => {
                        const firstAvailable = related.variants?.find((v) => v.available_stock > 0) || related.variants?.[0];
                        return (
                            <div key={related.id} className="group cursor-pointer">
                                <Link href={route('products.show', related.slug)}>
                                    <div className="aspect-[3/4] bg-[var(--cbx-surface-container)] relative overflow-hidden mb-3 rounded-lg">
                                        <img
                                            src={productPrimaryImage(related)}
                                            alt={related.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {firstAvailable && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    quickAddToCart(related);
                                                }}
                                                className="absolute bottom-4 left-4 right-4 bg-white py-2 text-[10px] font-bold uppercase translate-y-12 group-hover:translate-y-0 transition-transform duration-300 shadow-sm"
                                            >
                                                Quick Add
                                            </button>
                                        )}
                                    </div>
                                    <h3 className="text-sm text-[var(--cbx-on-surface)] mb-1">{related.name}</h3>
                                    <p className="cbx-price">{formatCurrency(productPrice(related))}</p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            {showSizeGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowSizeGuide(false)}>
                    <div className="relative max-w-2xl w-full bg-white rounded-xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-[var(--cbx-border-subtle)] p-4 flex justify-between items-center">
                            <h2 className="font-heading text-xl font-semibold">Size Guide</h2>
                            <button onClick={() => setShowSizeGuide(false)} className="p-1 hover:bg-[var(--cbx-surface-container-low)] rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <pre className="whitespace-pre-wrap text-sm text-[var(--cbx-on-surface-variant)] leading-relaxed font-sans">{product.size_chart || 'Size guidance will be published soon.'}</pre>
                        </div>
                    </div>
                </div>
            )}

            {showLightbox && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setShowLightbox(false)}>
                    <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors" onClick={() => setShowLightbox(false)}>
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <img src={selectedImage} alt={product.name} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </StorefrontLayout>
    );
}
