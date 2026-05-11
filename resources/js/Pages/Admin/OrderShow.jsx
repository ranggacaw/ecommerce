import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';

const selectClassName = 'cbx-field w-full text-sm';

export default function OrderShow({ order }) {
    const form = useForm({
        status: order.status,
        payment_status: order.payment_status,
        fulfillment_status: order.fulfillment_status,
    });

    const shipment = order.shipments?.[0];

    return (
        <AdminLayout title={`Order ${order.number}`} section="orders">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <Card>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="cbx-kicker">Order detail</p>
                            <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">{order.number}</h2>
                        </div>
                        <div className="space-y-3 text-sm text-[var(--cbx-on-surface-variant)]">
                            {order.items.map((item) => (
                                <div key={item.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{item.product_name}</p>
                                    <p>{item.variant_name} · {item.sku}</p>
                                    <p className="cbx-price mt-2 text-base">{formatCurrency(item.total_price)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                            <p className="font-semibold text-[var(--cbx-on-surface)]">Ship to</p>
                            <p className="mt-2">{order.address_snapshot.recipient_name}</p>
                            <p>{order.address_snapshot.line1}</p>
                            <p>{order.address_snapshot.city}, {order.address_snapshot.province} {order.address_snapshot.postal_code}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="cbx-kicker">Operations</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Status control</h2>
                        </div>
                        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.orders.update', order.id)); }} className="space-y-4">
                            <select value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className={selectClassName}>
                                {['pending', 'processing', 'completed', 'cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <select value={form.data.payment_status} onChange={(event) => form.setData('payment_status', event.target.value)} className={selectClassName}>
                                {['pending', 'paid', 'failed'].map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <select value={form.data.fulfillment_status} onChange={(event) => form.setData('fulfillment_status', event.target.value)} className={selectClassName}>
                                {['awaiting_fulfillment', 'packed', 'shipped', 'delivered'].map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <Button type="submit" className="w-full">Update order</Button>
                        </form>
                        <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                            <p className="font-semibold text-[var(--cbx-on-surface)]">Shipment</p>
                            <p className="mt-2">{shipment?.service_name}</p>
                            <p>Tracking: {shipment?.tracking_number}</p>
                            <p>Status: {shipment?.status}</p>
                            <Link href={route('admin.orders.label', order.id)} className="mt-3 inline-flex text-sm font-semibold text-[var(--cbx-secondary)]">Print shipping label</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
