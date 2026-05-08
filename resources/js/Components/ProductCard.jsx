import { useState } from 'react';
import { Card, CardContent } from '@/Components/ui/Card';
import { formatCurrency, productPrimaryImage, productPrice } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { Heart } from 'lucide-react';

export default function ProductCard({ product }) {
    const currentPrice = Number(productPrice(product));
    const comparePrice = Number(product.compare_price || 0);
    const hasComparePrice = comparePrice > currentPrice;
    const discountPercent = hasComparePrice ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0;
    const [isWishlisted, setIsWishlisted] = useState(false);

    const toggleWishlist = (e) => {
        e.preventDefault(); // Prevent Link navigation
        setIsWishlisted(!isWishlisted);
        // We always try to store since the prompt specifically mentions saving. 
        // Backend logic can handle duplicates if needed.
        router.post(route('account.wishlist.store'), { product_id: product.id }, { preserveScroll: true });
    };

    return (
        <Card className="overflow-hidden rounded-sm border-0 bg-gray-50/50">
            <Link href={route('products.show', product.slug)}>
                <div className="relative">
                    <img
                        src={productPrimaryImage(product)}
                        alt={product.name}
                        className="h-80 w-full object-cover mix-blend-multiply"
                    />
                    {hasComparePrice && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black text-white py-1.5 px-2 text-center flex flex-col">
                            <span className="font-bold text-[0.7rem] leading-tight">{discountPercent}% off</span>
                            <span className="text-[9px] leading-tight">Tanpa min. belanja, maks. potongan Rp500.000.</span>
                        </div>
                    )}
                </div>
                <CardContent className="px-3 py-3 space-y-2 bg-white">
                    <div>
                        <div className="flex justify-between items-start">
                            <p className="font-heading text-sm font-semibold text-[var(--cbx-on-surface)] hover:text-[var(--cbx-secondary)]">
                                {product.brand || 'Unknown'}
                            </p>
                            <button onClick={toggleWishlist} className={`text-gray-400 hover:text-red-500 transition-colors ${isWishlisted ? 'text-red-500' : ''}`}>
                                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                        <p className="text-xs text-[var(--cbx-on-surface)] hover:text-[var(--cbx-secondary)]">
                            {product.name}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <p className={`text-sm font-bold ${hasComparePrice ? 'text-red-600' : 'text-[var(--cbx-neutral-mid)]'}`}>{formatCurrency(currentPrice)}</p>
                                {hasComparePrice && (
                                    <>
                                        <span className="text-xs text-[var(--cbx-neutral-mid)] line-through">{formatCurrency(comparePrice)}</span>
                                        <span className="text-[10px] text-red-600 bg-red-50 px-1 py-0.5 rounded font-medium">-{discountPercent}%</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
