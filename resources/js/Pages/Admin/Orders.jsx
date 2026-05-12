import StatCard from '@/Components/StatCard';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';

const selectClassName = 'cbx-field w-full text-sm';

export default function Orders({ stats, orders, variants, filters, options }) {
    const orderForm = useForm({
        email: '',
        phone: '',
        recipient_name: '',
        line1: '',
        city: '',
        province: '',
        postal_code: '',
        country: 'Indonesia',
        product_variant_id: variants[0]?.id || '',
        quantity: 1,
        payment_method: 'manual_transfer',
        payment_status: 'pending',
        shipping_service_name: 'Manual dispatch',
        shipping_total: 0,
        tracking_number: '',
        notes: '',
    });

    const filteredArchivedCount = orders.filter((order) => order.archived_at).length;

    return (
        <AdminLayout
            title="Orders"
            section="orders"
            description="Review the queue, create manual orders, and use cancel or archive workflows without breaking fulfillment history."
            toolbarSearchValue={filters.q}
            toolbarSearchAction={route('admin.orders.index')}
            toolbarSearchPlaceholder="Search order numbers, customers, or cities..."
        >
            <div className="space-y-8">
                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Queue filters</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Search the order workspace</h2>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">
                                Narrow the queue by customer, order state, payment status, fulfillment stage, or archive state before jumping into detail workflows.
                            </p>
                        </div>

                        <form action={route('admin.orders.index')} method="get" className="grid gap-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4 md:grid-cols-2 xl:grid-cols-5">
                            <Input name="q" defaultValue={filters.q} placeholder="Search orders or customers" />
                            <select name="status" defaultValue={filters.status} className={selectClassName}>
                                {options.statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <select name="payment_status" defaultValue={filters.payment_status} className={selectClassName}>
                                {options.paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <select name="fulfillment_status" defaultValue={filters.fulfillment_status} className={selectClassName}>
                                {options.fulfillmentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <select name="archived" defaultValue={filters.archived} className={selectClassName}>
                                {options.archiveFilters.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <Button type="submit" variant="secondary">Apply</Button>
                            <Link href={route('admin.orders.index')} className="inline-flex items-center justify-center rounded-lg border border-[var(--cbx-outline-variant)] px-4 py-2 text-sm font-semibold text-[var(--cbx-on-surface)] transition-colors hover:bg-[var(--cbx-surface-container-low)]">Reset</Link>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <Card>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="cbx-kicker">Order actions</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Create order</h2>
                                <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Use this form for assisted checkouts, phone orders, or back-office replacements.</p>
                            </div>

                            {variants.length === 0 ? (
                                <p className="text-sm text-[var(--cbx-on-surface-variant)]">Create an active product variant before entering manual orders.</p>
                            ) : (
                                <form onSubmit={(event) => { event.preventDefault(); orderForm.post(route('admin.orders.store')); }} className="space-y-4">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={orderForm.data.email} onChange={(event) => orderForm.setData('email', event.target.value)} placeholder="Customer email" />
                                        <Input value={orderForm.data.phone} onChange={(event) => orderForm.setData('phone', event.target.value)} placeholder="Phone" />
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={orderForm.data.recipient_name} onChange={(event) => orderForm.setData('recipient_name', event.target.value)} placeholder="Recipient name" />
                                        <Input value={orderForm.data.line1} onChange={(event) => orderForm.setData('line1', event.target.value)} placeholder="Address line" />
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                        <Input value={orderForm.data.city} onChange={(event) => orderForm.setData('city', event.target.value)} placeholder="City" />
                                        <Input value={orderForm.data.province} onChange={(event) => orderForm.setData('province', event.target.value)} placeholder="Province" />
                                        <Input value={orderForm.data.postal_code} onChange={(event) => orderForm.setData('postal_code', event.target.value)} placeholder="Postal code" />
                                        <Input value={orderForm.data.country} onChange={(event) => orderForm.setData('country', event.target.value)} placeholder="Country" />
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                        <select value={orderForm.data.product_variant_id} onChange={(event) => orderForm.setData('product_variant_id', event.target.value)} className={selectClassName}>
                                            {variants.map((variant) => (
                                                <option key={variant.id} value={variant.id}>{variant.product?.name} · {variant.sku}</option>
                                            ))}
                                        </select>
                                        <Input type="number" min="1" value={orderForm.data.quantity} onChange={(event) => orderForm.setData('quantity', event.target.value)} placeholder="Quantity" />
                                        <select value={orderForm.data.payment_status} onChange={(event) => orderForm.setData('payment_status', event.target.value)} className={selectClassName}>
                                            <option value="pending">pending</option>
                                            <option value="paid">paid</option>
                                        </select>
                                        <Input value={orderForm.data.payment_method} onChange={(event) => orderForm.setData('payment_method', event.target.value)} placeholder="Payment method" />
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-3">
                                        <Input value={orderForm.data.shipping_service_name} onChange={(event) => orderForm.setData('shipping_service_name', event.target.value)} placeholder="Shipping service" />
                                        <Input type="number" min="0" value={orderForm.data.shipping_total} onChange={(event) => orderForm.setData('shipping_total', event.target.value)} placeholder="Shipping total" />
                                        <Input value={orderForm.data.tracking_number} onChange={(event) => orderForm.setData('tracking_number', event.target.value)} placeholder="Tracking number (optional)" />
                                    </div>
                                    <Input value={orderForm.data.notes} onChange={(event) => orderForm.setData('notes', event.target.value)} placeholder="Notes" />
                                    <Button type="submit">Create order</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="cbx-kicker">Lifecycle rules</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Retire orders safely</h2>
                            </div>
                            <div className="grid gap-3 text-sm text-[var(--cbx-on-surface-variant)]">
                                <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">Cancel when the order should stop moving</p>
                                    <p className="mt-2">Use cancel from the detail view to preserve notes and release inventory when the workflow needs to stop.</p>
                                </div>
                                <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">Archive when the work is finished</p>
                                    <p className="mt-2">Archive completed or inactive orders instead of deleting them so label and fulfillment history stays intact.</p>
                                </div>
                                <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">Current filtered archive count</p>
                                    <p className="mt-2 text-base font-semibold text-[var(--cbx-on-surface)]">{filteredArchivedCount} archived orders in this result set</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Workspace</p>
                            <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Order queue</h2>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Search and filter the active or archived order queue, then jump into the detail workflow.</p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-[960px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Order</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Customer</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Total</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Status</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Payment</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Fulfillment</th>
                                            <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-14 text-center text-sm text-[var(--cbx-on-surface-variant)]">Orders will appear here once the storefront starts generating checkouts.</td>
                                            </tr>
                                        ) : orders.map((order) => (
                                            <tr key={order.id} className="border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)]">
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold text-[var(--cbx-on-surface)]">{order.number}</div>
                                                    <div className="text-xs text-[var(--cbx-on-surface-variant)]">{order.address_snapshot?.city || 'No city'}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface)]">{order.address_snapshot?.recipient_name || order.email}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-[var(--cbx-on-surface)]">{formatCurrency(order.grand_total)}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{order.status}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{order.payment_status}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{order.fulfillment_status}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {order.archived_at ? <span className="rounded-full bg-[var(--cbx-surface-container-low)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Archived</span> : null}
                                                        <Link href={route('admin.orders.show', order.id)} className="text-sm font-semibold text-[var(--cbx-secondary)]">Process</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-4 p-4 lg:hidden">
                                {orders.length === 0 ? (
                                    <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">Orders will appear here once the storefront starts generating checkouts.</p>
                                ) : orders.map((order) => (
                                    <div key={order.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-[var(--cbx-on-surface)]">{order.number}</p>
                                                <p className="text-sm text-[var(--cbx-on-surface-variant)]">{order.address_snapshot?.recipient_name} · {order.address_snapshot?.city}</p>
                                            </div>
                                            {order.archived_at ? <span className="rounded-full bg-[var(--cbx-surface-container-low)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Archived</span> : null}
                                        </div>
                                        <div className="mt-3 grid gap-1 text-sm text-[var(--cbx-on-surface-variant)]">
                                            <p>Total: {formatCurrency(order.grand_total)}</p>
                                            <p>Status: {order.status}</p>
                                            <p>Payment: {order.payment_status}</p>
                                            <p>Fulfillment: {order.fulfillment_status}</p>
                                        </div>
                                        <div className="mt-4">
                                            <Link href={route('admin.orders.show', order.id)} className="text-sm font-semibold text-[var(--cbx-secondary)]">Process order</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-3">
                    <StatCard label="Open orders" value={stats.open} />
                    <StatCard label="Awaiting fulfillment" value={stats.awaitingFulfillment} />
                    <StatCard label="Paid orders" value={stats.paid} />
                </div>
            </div>
        </AdminLayout>
    );
}
