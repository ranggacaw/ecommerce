import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { formatCurrency, productPrimaryImage } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';

export default function CartIndex({ cart }) {
    const { auth } = usePage().props;
    const subtotal = cart?.items?.reduce((carry, item) => carry + Number(item.line_total || 0), 0) || 0;

    return (
        <StorefrontLayout title="Shopping Bag">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <Card>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="cbx-kicker">Shopping bag</p>
                            <h1 className="mt-2 font-heading text-4xl font-semibold text-[var(--cbx-on-surface)]">Your selected pieces</h1>
                        </div>

                        {cart?.items?.length ? cart.items.map((item) => (
                            <div key={item.id} className="grid gap-4 rounded-xl border border-[var(--cbx-border-subtle)] p-4 md:grid-cols-[160px_1fr]">
                                <img src={productPrimaryImage(item.variant?.product)} alt={item.variant?.product?.name} className="h-40 w-full rounded-xl object-cover" />
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="font-heading text-lg font-semibold text-[var(--cbx-on-surface)]">{item.variant?.product?.name}</p>
                                            <p className="text-sm text-[var(--cbx-on-surface-variant)]">{item.variant?.display_name}</p>
                                        </div>
                                        <p className="cbx-price text-base">{formatCurrency(item.line_total)}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <select value={item.quantity} onChange={(event) => router.patch(route('cart.update', item.id), { quantity: event.target.value })} className="cbx-field w-auto py-2 text-sm">
                                            {Array.from({ length: 10 }).map((_, index) => (
                                                <option key={index + 1} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                        <Button variant="ghost" onClick={() => router.delete(route('cart.destroy', item.id))}>Remove</Button>
                                    </div>
                                </div>
                            </div>
                        )) : <p className="text-[var(--cbx-on-surface-variant)]">Your bag is empty. Explore the catalog to start building a look.</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="cbx-kicker">Summary</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Checkout readiness</h2>
                        </div>
                        <div className="space-y-3 text-sm text-[var(--cbx-on-surface-variant)]">
                            <div className="flex justify-between"><span>Items</span><span>{cart?.items?.length || 0}</span></div>
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
                        </div>
                        {auth.user ? (
                            <Link href={route('checkout.create')}>
                                <Button className="w-full" size="lg" disabled={!cart?.items?.length}>Continue to checkout</Button>
                            </Link>
                        ) : (
                            <div className="space-y-3">
                                <Link href={route('login')}><Button className="w-full" size="lg">Sign in to checkout</Button></Link>
                                <p className="text-sm leading-6 text-[var(--cbx-on-surface-variant)]">Your bag stays saved. Sign in now and we will continue from this exact selection.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </StorefrontLayout>
    );
}
