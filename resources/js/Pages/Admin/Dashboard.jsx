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

export default function Dashboard({ stats, recentOrders, lowStockVariants, recentAdjustments, filters }) {
    return (
        <AdminLayout
            title="Dashboard"
            section="dashboard"
            description="Jump into each admin workspace, monitor recent activity, and spot order or stock issues before they spread."
            toolbarSearchValue={filters.q}
            toolbarSearchAction={route('admin.dashboard')}
            toolbarSearchPlaceholder="Search recent orders, stock, or adjustments..."
        >
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
                        <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-[720px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Order</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Total</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Payment</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Fulfillment</th>
                                            <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-10 text-center text-sm text-[var(--cbx-on-surface-variant)]">Orders will appear here once customers begin checking out.</td>
                                            </tr>
                                        ) : recentOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)]">
                                                <td className="px-4 py-3 font-semibold text-[var(--cbx-on-surface)]">{order.number}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface)]">{formatCurrency(order.grand_total)}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{order.payment_status}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{order.fulfillment_status}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link href={route('admin.orders.show', order.id)} className="text-sm font-semibold text-[var(--cbx-secondary)]">Review</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-4 p-4 lg:hidden">
                                {recentOrders.length === 0 ? (
                                    <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">Orders will appear here once customers begin checking out.</p>
                                ) : recentOrders.map((order) => (
                                    <div key={order.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                        <p className="font-semibold text-[var(--cbx-on-surface)]">{order.number}</p>
                                        <div className="mt-2 grid gap-1 text-sm text-[var(--cbx-on-surface-variant)]">
                                            <p>Total: {formatCurrency(order.grand_total)}</p>
                                            <p>Payment: {order.payment_status}</p>
                                            <p>Fulfillment: {order.fulfillment_status}</p>
                                        </div>
                                        <Link href={route('admin.orders.show', order.id)} className="mt-4 inline-flex text-sm font-semibold text-[var(--cbx-secondary)]">Review order</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card>
                        <CardContent className="space-y-4">
                            <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Low stock</h2>
                            <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                                <div className="hidden overflow-x-auto lg:block">
                                    <table className="w-full min-w-[460px] border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Product</th>
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Variant</th>
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Sellable</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lowStockVariants.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-10 text-center text-sm text-[var(--cbx-on-surface-variant)]">No low-stock variants right now.</td>
                                                </tr>
                                            ) : lowStockVariants.map((variant) => (
                                                <tr key={variant.id} className="border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)]">
                                                    <td className="px-4 py-3 font-semibold text-[var(--cbx-on-surface)]">{variant.product?.name}</td>
                                                    <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{variant.sku} · {variant.color || 'No color'} / {variant.size || 'No size'}</td>
                                                    <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface)]">{variant.stock_on_hand - variant.stock_reserved}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="space-y-4 p-4 lg:hidden">
                                    {lowStockVariants.length === 0 ? (
                                        <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">No low-stock variants right now.</p>
                                    ) : lowStockVariants.map((variant) => (
                                        <div key={variant.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                            <p className="font-semibold text-[var(--cbx-on-surface)]">{variant.product?.name}</p>
                                            <p>{variant.sku} · {variant.color || 'No color'} / {variant.size || 'No size'}</p>
                                            <p className="mt-1">Sellable stock: {variant.stock_on_hand - variant.stock_reserved}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="space-y-4">
                            <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Inventory journal</h2>
                            <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                                <div className="hidden overflow-x-auto lg:block">
                                    <table className="w-full min-w-[460px] border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Variant</th>
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Type</th>
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentAdjustments.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-10 text-center text-sm text-[var(--cbx-on-surface-variant)]">Inventory adjustments will appear here after staff updates stock.</td>
                                                </tr>
                                            ) : recentAdjustments.map((adjustment) => (
                                                <tr key={adjustment.id} className="border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)]">
                                                    <td className="px-4 py-3 font-semibold text-[var(--cbx-on-surface)]">{adjustment.variant?.product?.name} · {adjustment.variant?.sku}</td>
                                                    <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{adjustment.type} via {adjustment.source}</td>
                                                    <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface)]">{adjustment.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="space-y-4 p-4 lg:hidden">
                                    {recentAdjustments.length === 0 ? (
                                        <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">Inventory adjustments will appear here after staff updates stock.</p>
                                    ) : recentAdjustments.map((adjustment) => (
                                        <div key={adjustment.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                            <p className="font-semibold text-[var(--cbx-on-surface)]">{adjustment.variant?.product?.name} · {adjustment.variant?.sku}</p>
                                            <p className="mt-1">{adjustment.type} · {adjustment.quantity} units via {adjustment.source}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
