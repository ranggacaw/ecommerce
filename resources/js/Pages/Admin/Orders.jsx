import StatCard from '@/Components/StatCard';
import { Card, CardContent } from '@/Components/ui/Card';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function Orders({ stats, orders }) {
    return (
        <AdminLayout title="Orders" section="orders">
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard label="Open orders" value={stats.open} />
                <StatCard label="Awaiting fulfillment" value={stats.awaitingFulfillment} />
                <StatCard label="Paid orders" value={stats.paid} />
            </div>

            <Card>
                <CardContent className="space-y-4">
                    <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Order queue</h2>
                    <div className="space-y-3">
                        {orders.length === 0 ? (
                            <p className="text-sm text-[var(--cbx-on-surface-variant)]">Orders will appear here once the storefront starts generating checkouts.</p>
                        ) : orders.map((order) => (
                            <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{order.number}</p>
                                    <p className="text-sm text-[var(--cbx-neutral-mid)]">{formatCurrency(order.grand_total)} · {order.payment_status} · {order.fulfillment_status}</p>
                                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">{order.address_snapshot?.recipient_name} · {order.address_snapshot?.city}</p>
                                </div>
                                <Link href={route('admin.orders.show', order.id)} className="text-sm font-semibold text-[var(--cbx-secondary)]">
                                    Process order
                                </Link>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
