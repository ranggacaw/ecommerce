import StatCard from '@/Components/StatCard';
import { Card, CardContent } from '@/Components/ui/Card';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

const sections = [
    {
        key: 'catalog',
        title: 'Catalog',
        routeName: 'admin.catalog',
        description: 'Products, categories, and collections for the storefront catalog.',
        summary: (stats) => `${stats.products} products, ${stats.categories} categories, ${stats.collections} collections`,
    },
    {
        key: 'merchandising',
        title: 'Merchandising',
        routeName: 'admin.merchandising',
        description: 'Hero banners and promotions that shape homepage campaigns.',
        summary: (stats) => `${stats.banners} banners, ${stats.promotions} promotions`,
    },
    {
        key: 'locations',
        title: 'Store locations',
        routeName: 'admin.locations',
        description: 'Physical store details, ordering, and active storefront visibility.',
        summary: (stats) => `${stats.locations} locations configured`,
    },
    {
        key: 'inventory',
        title: 'Inventory',
        routeName: 'admin.inventory',
        description: 'Manual stock adjustments and low-stock follow-up.',
        summary: (stats) => `${stats.lowStock} low-stock variants`,
    },
    {
        key: 'orders',
        title: 'Orders',
        routeName: 'admin.orders.index',
        description: 'Order review, status changes, fulfillment, and label printing.',
        summary: (stats) => `${stats.orders} orders in the system`,
    },
];

export default function Dashboard({ stats, recentOrders, lowStockVariants, recentAdjustments }) {
    return (
        <AdminLayout title="Dashboard" section="dashboard">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Products" value={stats.products} />
                <StatCard label="Categories" value={stats.categories} />
                <StatCard label="Orders" value={stats.orders} />
                <StatCard label="Low stock" value={stats.lowStock} help="Variants at three sellable units or fewer." />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                {sections.map((section) => (
                    <Card key={section.key}>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="cbx-kicker">Section</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">{section.title}</h2>
                            </div>
                            <p className="text-sm text-[var(--cbx-on-surface-variant)]">{section.description}</p>
                            <p className="text-sm font-medium text-[var(--cbx-on-surface)]">{section.summary(stats)}</p>
                            <Link href={route(section.routeName)} className="inline-flex text-sm font-semibold text-[var(--cbx-secondary)]">
                                Open {section.title.toLowerCase()}
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardContent className="space-y-4">
                        <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Recent orders</h2>
                        <div className="space-y-3">
                            {recentOrders.length === 0 ? (
                                <p className="text-sm text-[var(--cbx-on-surface-variant)]">Orders will appear here once customers begin checking out.</p>
                            ) : recentOrders.map((order) => (
                                <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-semibold text-[var(--cbx-on-surface)]">{order.number}</p>
                                        <p className="text-sm text-[var(--cbx-neutral-mid)]">{formatCurrency(order.grand_total)} · {order.payment_status} · {order.fulfillment_status}</p>
                                    </div>
                                    <Link href={route('admin.orders.show', order.id)} className="text-sm font-semibold text-[var(--cbx-secondary)]">
                                        Review order
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card>
                        <CardContent className="space-y-4">
                            <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Low stock</h2>
                            <div className="space-y-3">
                                {lowStockVariants.length === 0 ? (
                                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">No low-stock variants right now.</p>
                                ) : lowStockVariants.map((variant) => (
                                    <div key={variant.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                        <p className="font-semibold text-[var(--cbx-on-surface)]">{variant.product?.name}</p>
                                        <p>{variant.sku} · {variant.color || 'No color'} / {variant.size || 'No size'}</p>
                                        <p className="mt-1">Sellable stock: {variant.stock_on_hand - variant.stock_reserved}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="space-y-4">
                            <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Inventory journal</h2>
                            <div className="space-y-3">
                                {recentAdjustments.length === 0 ? (
                                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">Inventory adjustments will appear here after staff updates stock.</p>
                                ) : recentAdjustments.map((adjustment) => (
                                    <div key={adjustment.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                        <p className="font-semibold text-[var(--cbx-on-surface)]">{adjustment.variant?.product?.name} · {adjustment.variant?.sku}</p>
                                        <p className="mt-1">{adjustment.type} · {adjustment.quantity} units via {adjustment.source}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
