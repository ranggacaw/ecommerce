import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import { formatCurrency, productPrimaryImage, productPrice } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    const hasComparePrice = Number(product.compare_price || 0) > Number(productPrice(product));

    return (
        <Card className="overflow-hidden">
            <Link href={route('products.show', product.slug)}>
                <img
                    src={productPrimaryImage(product)}
                    alt={product.name}
                    className="h-80 w-full object-cover"
                />
            </Link>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {product.is_new_arrival ? <Badge className="border-[var(--cbx-brand-light-pink)] bg-[var(--cbx-brand-light-pink)] text-[var(--cbx-accent-crimson)]">New</Badge> : null}
                    {product.is_promoted ? <Badge className="border-[var(--cbx-secondary-container)] bg-[var(--cbx-secondary-container)] text-white">Promo</Badge> : null}
                    <Badge>{product.category?.name}</Badge>
                </div>
                <div>
                    <Link href={route('products.show', product.slug)} className="font-heading text-xl font-semibold text-[var(--cbx-on-surface)] hover:text-[var(--cbx-secondary)]">
                        {product.name}
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-[var(--cbx-on-surface-variant)]">{product.short_description}</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="cbx-kicker">From</p>
                        <div className="flex items-center gap-2">
                            <p className="cbx-price">{formatCurrency(productPrice(product))}</p>
                            {hasComparePrice ? <span className="text-sm text-[var(--cbx-neutral-mid)] line-through">{formatCurrency(product.compare_price)}</span> : null}
                        </div>
                    </div>
                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">{product.variants?.length || 0} variants</p>
                </div>
                <Link href={route('products.show', product.slug)} className="cbx-button cbx-button-secondary w-full px-4 py-3 text-sm">
                    Select options
                </Link>
            </CardContent>
        </Card>
    );
}
