import ProductCard from '@/Components/ProductCard';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import AccountLayout from '@/Layouts/AccountLayout';
import { router } from '@inertiajs/react';

export default function Wishlist({ items }) {
    return (
        <AccountLayout title="Wishlist">
            <Card>
                <CardContent className="space-y-6">
                    <div>
                        <p className="cbx-kicker">Wishlist</p>
                        <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Saved for later</h1>
                    </div>
                    {items.length ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {items.map((item) => (
                                <div key={item.id} className="space-y-4">
                                    <ProductCard product={item.product} />
                                    <div className="flex gap-3">
                                        <Button className="flex-1" onClick={() => router.post(route('cart.store'), { variant_id: item.product.variants?.[0]?.id, quantity: 1 })}>Move to bag</Button>
                                        <Button variant="secondary" className="flex-1" onClick={() => router.delete(route('account.wishlist.destroy', item.id))}>Remove</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-[var(--cbx-on-surface-variant)]">No wishlist items yet.</p>}
                </CardContent>
            </Card>
        </AccountLayout>
    );
}
