import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { formatCurrency } from '@/lib/utils';

export default function OrderShow({ order }) {
    return (
        <StorefrontLayout title={`Order ${order.number}`}>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <Card>
                    <CardContent className="space-y-5">
                        <div>
                            <p className="cbx-kicker">Order placed</p>
                            <h1 className="mt-2 font-heading text-4xl font-semibold text-[var(--cbx-on-surface)]">{order.number}</h1>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge>{order.status}</Badge>
                            <Badge>{order.payment_status}</Badge>
                            <Badge>{order.fulfillment_status}</Badge>
                        </div>
                        <div className="space-y-3 text-sm text-[var(--cbx-on-surface-variant)]">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-4 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <div>
                                        <p className="font-semibold text-[var(--cbx-on-surface)]">{item.product_name}</p>
                                        <p className="text-[var(--cbx-neutral-mid)]">{item.variant_name} · Qty {item.quantity}</p>
                                    </div>
                                    <p>{formatCurrency(item.total_price)}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-5">
                        <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Payment and delivery</h2>
                        <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                            <p className="font-semibold text-[var(--cbx-on-surface)]">Payment</p>
                            <p className="mt-2">Method: {order.payments?.[0]?.method}</p>
                            <p>Status: {order.payments?.[0]?.status}</p>
                        </div>
                        <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                            <p className="font-semibold text-[var(--cbx-on-surface)]">Shipment</p>
                            <p className="mt-2">Service: {order.shipments?.[0]?.service_name}</p>
                            <p>Tracking: {order.shipments?.[0]?.tracking_number}</p>
                            <p>Status: {order.shipments?.[0]?.status}</p>
                        </div>
                        <div className="space-y-2 border-t border-[var(--cbx-border-subtle)] pt-4 text-sm text-[var(--cbx-on-surface-variant)]">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shipping_total)}</span></div>
                            <div className="flex justify-between text-base font-semibold text-[var(--cbx-on-surface)]"><span>Total</span><span>{formatCurrency(order.grand_total)}</span></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </StorefrontLayout>
    );
}
