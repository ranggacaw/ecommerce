import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import AccountLayout from '@/Layouts/AccountLayout';
import { formatCurrency } from '@/lib/utils';
import { useForm } from '@inertiajs/react';

export default function CheckoutIndex({ cart, addresses, selectedAddressId, shippingOptions, paymentMethods }) {
    const subtotal = cart.items.reduce((carry, item) => carry + Number(item.line_total || 0), 0);
    const form = useForm({
        address_id: selectedAddressId,
        shipping_code: shippingOptions[0]?.code || '',
        payment_method: paymentMethods[0]?.code || '',
    });

    const selectedShipping = shippingOptions.find((option) => option.code === form.data.shipping_code);

    return (
        <AccountLayout title="Checkout">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <Card>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="cbx-kicker">Checkout</p>
                            <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Shipping and payment</h1>
                        </div>
                        <form onSubmit={(event) => { event.preventDefault(); form.post(route('checkout.store')); }} className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="font-heading text-lg font-semibold text-[var(--cbx-on-surface)]">1. Delivery address</h2>
                                <div className="grid gap-4">
                                    {addresses.map((address) => (
                                        <label key={address.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                            <input type="radio" name="address_id" checked={form.data.address_id === address.id} onChange={() => form.setData('address_id', address.id)} className="mr-3" />
                                            <span className="font-semibold text-[var(--cbx-on-surface)]">{address.label || 'Address'}</span>
                                            <span className="block mt-2">{address.recipient_name} · {address.phone}</span>
                                            <span className="block text-[var(--cbx-neutral-mid)]">{address.line1}, {address.city}, {address.province}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="font-heading text-lg font-semibold text-[var(--cbx-on-surface)]">2. Shipping option</h2>
                                <div className="grid gap-3">
                                    {shippingOptions.map((option) => (
                                        <label key={option.code} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                            <input type="radio" name="shipping_code" checked={form.data.shipping_code === option.code} onChange={() => form.setData('shipping_code', option.code)} className="mr-3" />
                                            <span className="font-semibold text-[var(--cbx-on-surface)]">{option.label}</span>
                                            <span className="ml-2">{option.eta}</span>
                                            <span className="cbx-price mt-2 block text-base">{formatCurrency(option.cost)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="font-heading text-lg font-semibold text-[var(--cbx-on-surface)]">3. Payment method</h2>
                                <div className="grid gap-3">
                                    {paymentMethods.map((method) => (
                                        <label key={method.code} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                            <input type="radio" name="payment_method" checked={form.data.payment_method === method.code} onChange={() => form.setData('payment_method', method.code)} className="mr-3" />
                                            <span className="font-semibold text-[var(--cbx-on-surface)]">{method.label}</span>
                                            <span className="block mt-1 text-[var(--cbx-neutral-mid)]">{method.description}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={form.processing}>Place order</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-6">
                        <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Order summary</h2>
                        <div className="space-y-3 text-sm text-[var(--cbx-on-surface-variant)]">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-[var(--cbx-on-surface)]">{item.variant.product.name}</p>
                                        <p className="text-[var(--cbx-neutral-mid)]">{item.variant.display_name} · Qty {item.quantity}</p>
                                    </div>
                                    <p>{formatCurrency(item.line_total)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 border-t border-[var(--cbx-border-subtle)] pt-4 text-sm text-[var(--cbx-on-surface-variant)]">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(selectedShipping?.cost || 0)}</span></div>
                            <div className="flex justify-between text-base font-semibold text-[var(--cbx-on-surface)]"><span>Total</span><span>{formatCurrency(subtotal + Number(selectedShipping?.cost || 0))}</span></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AccountLayout>
    );
}
