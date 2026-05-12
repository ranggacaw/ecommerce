import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const selectClassName = 'cbx-field w-full text-sm';

function AdjustmentEditor({ adjustment, variants, types, sources }) {
    const form = useForm({
        product_variant_id: adjustment.product_variant_id,
        type: adjustment.type,
        source: adjustment.source,
        quantity: adjustment.quantity,
        notes: adjustment.notes ?? '',
    });

    const voidAdjustment = () => {
        const reason = window.prompt(`Void adjustment #${adjustment.id}. Enter a reason:`);

        if (!reason) {
            return;
        }

        router.patch(route('admin.inventory.adjustments.void', adjustment.id), { void_reason: reason }, { preserveScroll: true });
    };

    return (
        <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
            <p className="font-semibold text-[var(--cbx-on-surface)]">{adjustment.variant?.product?.name} · {adjustment.variant?.sku}</p>
            <p className="mt-1">{adjustment.type} · {adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity} units via {adjustment.source}</p>
            <p>{adjustment.user?.name || 'Staff user'}</p>
            {adjustment.notes ? <p className="mt-1">{adjustment.notes}</p> : null}
            {adjustment.status !== 'active' ? (
                <div className="mt-3 rounded-lg bg-[var(--cbx-surface-container-low)] p-3">
                    <p className="font-medium capitalize text-[var(--cbx-on-surface)]">{adjustment.status}</p>
                    {adjustment.void_reason ? <p className="mt-1">Reason: {adjustment.void_reason}</p> : null}
                    {adjustment.replacement_adjustment ? <p className="mt-1">Replaced by adjustment #{adjustment.replacement_adjustment.id}</p> : null}
                </div>
            ) : (
                <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.inventory.adjustments.update', adjustment.id), { preserveScroll: true }); }} className="mt-4 space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                        <select value={form.data.product_variant_id} onChange={(event) => form.setData('product_variant_id', event.target.value)} className={selectClassName}>
                            {variants.map((variant) => (
                                <option key={variant.id} value={variant.id}>{variant.product?.name} · {variant.sku}</option>
                            ))}
                        </select>
                        <select value={form.data.type} onChange={(event) => form.setData('type', event.target.value)} className={selectClassName}>
                            {types.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <select value={form.data.source} onChange={(event) => form.setData('source', event.target.value)} className={selectClassName}>
                            {sources.map((source) => <option key={source} value={source}>{source}</option>)}
                        </select>
                        <Input value={form.data.quantity} onChange={(event) => form.setData('quantity', event.target.value)} placeholder="Quantity delta" />
                    </div>
                    <Input value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} placeholder="Notes" />
                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" variant="secondary" size="sm">Update adjustment</Button>
                        <Button type="button" variant="danger" size="sm" onClick={voidAdjustment}>Void adjustment</Button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function Inventory({ variants, lowStockVariants, inventoryAdjustments, filters, types, sources, statuses }) {
    const [selectedAdjustmentId, setSelectedAdjustmentId] = useState(inventoryAdjustments[0]?.id ?? null);
    const inventoryForm = useForm({
        product_variant_id: variants[0]?.id || '',
        type: types[1] ?? 'adjustment',
        source: sources[0] ?? 'manual',
        quantity: 0,
        notes: '',
    });

    const activeAdjustmentCount = inventoryAdjustments.filter((adjustment) => adjustment.status === 'active').length;
    const selectedAdjustment = inventoryAdjustments.find((adjustment) => adjustment.id === selectedAdjustmentId) ?? inventoryAdjustments[0] ?? null;

    return (
        <AdminLayout
            title="Inventory"
            section="inventory"
            description="Record stock changes, review audit-safe inventory history, and surface replenishment risk from one workspace."
            toolbarSearchValue={filters.q}
            toolbarSearchAction={route('admin.inventory')}
            toolbarSearchPlaceholder="Search variants or inventory journal entries..."
        >
            <div className="space-y-8">
                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Journal filters</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Search the inventory workspace</h2>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">
                                Filter the journal by SKU, product, type, and lifecycle status before editing or voiding an adjustment.
                            </p>
                        </div>

                        <form action={route('admin.inventory')} method="get" className="grid gap-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4 md:grid-cols-[1fr_180px_180px_auto_auto]">
                            <Input name="q" defaultValue={filters.q} placeholder="Search SKU, product, or notes" />
                            <select name="type" defaultValue={filters.type} className={selectClassName}>
                                <option value="all">All types</option>
                                {types.map((type) => <option key={type} value={type}>{type}</option>)}
                            </select>
                            <select name="status" defaultValue={filters.status} className={selectClassName}>
                                <option value="all">All statuses</option>
                                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <Button type="submit" variant="secondary">Apply</Button>
                            <Link href={route('admin.inventory')} className="inline-flex items-center justify-center rounded-lg border border-[var(--cbx-outline-variant)] px-4 py-2 text-sm font-semibold text-[var(--cbx-on-surface)] transition-colors hover:bg-[var(--cbx-surface-container-low)]">Reset</Link>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="grid gap-6">
                        <Card>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="cbx-kicker">Inventory actions</p>
                                    <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Update stock</h2>
                                </div>
                                {variants.length === 0 ? (
                                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">Create a product variant before recording inventory adjustments.</p>
                                ) : (
                                    <form onSubmit={(event) => { event.preventDefault(); inventoryForm.post(route('admin.inventory.adjustments.store')); }} className="space-y-4">
                                        <select value={inventoryForm.data.product_variant_id} onChange={(event) => inventoryForm.setData('product_variant_id', event.target.value)} className={selectClassName}>
                                            {variants.map((variant) => (
                                                <option key={variant.id} value={variant.id}>{variant.product?.name} · {variant.sku}</option>
                                            ))}
                                        </select>
                                        <div className="grid gap-3 md:grid-cols-3">
                                            <select value={inventoryForm.data.type} onChange={(event) => inventoryForm.setData('type', event.target.value)} className={selectClassName}>
                                                {types.map((type) => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                            <select value={inventoryForm.data.source} onChange={(event) => inventoryForm.setData('source', event.target.value)} className={selectClassName}>
                                                {sources.map((source) => <option key={source} value={source}>{source}</option>)}
                                            </select>
                                            <Input value={inventoryForm.data.quantity} onChange={(event) => inventoryForm.setData('quantity', event.target.value)} placeholder="Quantity delta" />
                                        </div>
                                        <Input value={inventoryForm.data.notes} onChange={(event) => inventoryForm.setData('notes', event.target.value)} placeholder="Notes" />
                                        <Button type="submit">Apply adjustment</Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="cbx-kicker">Watchlist</p>
                                        <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Low stock follow-up</h2>
                                    </div>
                                    <Link href={route('admin.inventory', { q: filters.q, type: filters.type, status: 'active' })} className="text-sm font-semibold text-[var(--cbx-secondary)]">View active journal</Link>
                                </div>
                                <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                                    <div className="hidden overflow-x-auto lg:block">
                                        <table className="w-full min-w-[560px] border-collapse text-left">
                                            <thead>
                                                <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Product</th>
                                                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">SKU</th>
                                                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Sellable stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lowStockVariants.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-10 text-center text-sm text-[var(--cbx-on-surface-variant)]">No variants currently need replenishment.</td>
                                                    </tr>
                                                ) : lowStockVariants.map((variant) => (
                                                    <tr key={variant.id} className="border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)]">
                                                        <td className="px-4 py-3 font-semibold text-[var(--cbx-on-surface)]">{variant.product?.name}</td>
                                                        <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{variant.sku}</td>
                                                        <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface)]">{variant.stock_on_hand - variant.stock_reserved}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="space-y-4 p-4 lg:hidden">
                                        {lowStockVariants.length === 0 ? (
                                            <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">No variants currently need replenishment.</p>
                                        ) : lowStockVariants.map((variant) => (
                                            <div key={variant.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                                <p className="font-semibold text-[var(--cbx-on-surface)]">{variant.product?.name}</p>
                                                <p>{variant.sku}</p>
                                                <p className="mt-1">Sellable stock: {variant.stock_on_hand - variant.stock_reserved}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="cbx-kicker">Workspace</p>
                                <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Inventory journal</h2>
                                <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Search, filter, update, and void stock movements without losing audit history.</p>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                                <div className="hidden overflow-x-auto lg:block">
                                    <table className="w-full min-w-[920px] border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Variant</th>
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Type</th>
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Qty</th>
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Source</th>
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Status</th>
                                                <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Notes</th>
                                                <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventoryAdjustments.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-14 text-center text-sm text-[var(--cbx-on-surface-variant)]">Inventory movements will appear here after the first adjustment.</td>
                                                </tr>
                                            ) : inventoryAdjustments.map((adjustment) => {
                                                const isSelected = selectedAdjustment?.id === adjustment.id;

                                                return (
                                                    <tr key={adjustment.id} className={`border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)] ${isSelected ? 'bg-[var(--cbx-surface-alt)]' : ''}`}>
                                                        <td className="px-4 py-3">
                                                            <div className="font-semibold text-[var(--cbx-on-surface)]">{adjustment.variant?.product?.name}</div>
                                                            <div className="text-xs text-[var(--cbx-on-surface-variant)]">{adjustment.variant?.sku}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{adjustment.type}</td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-[var(--cbx-on-surface)]">{adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}</td>
                                                        <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{adjustment.source}</td>
                                                        <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{adjustment.status}</td>
                                                        <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{adjustment.notes || 'No notes'}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedAdjustmentId(adjustment.id)}>
                                                                {adjustment.status === 'active' ? 'Edit' : 'Review'}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="space-y-4 p-4 lg:hidden">
                                    {inventoryAdjustments.length === 0 ? (
                                        <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">Inventory movements will appear here after the first adjustment.</p>
                                    ) : inventoryAdjustments.map((adjustment) => (
                                        <div key={adjustment.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{adjustment.variant?.product?.name}</p>
                                                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">{adjustment.variant?.sku}</p>
                                                </div>
                                                <span className="text-sm font-semibold text-[var(--cbx-on-surface)]">{adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}</span>
                                            </div>
                                            <div className="mt-3 grid gap-1 text-sm text-[var(--cbx-on-surface-variant)]">
                                                <p>{adjustment.type} via {adjustment.source}</p>
                                                <p>Status: {adjustment.status}</p>
                                                {adjustment.notes ? <p>Notes: {adjustment.notes}</p> : null}
                                            </div>
                                            <div className="mt-4">
                                                <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedAdjustmentId(adjustment.id)}>
                                                    {adjustment.status === 'active' ? 'Edit' : 'Review'}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedAdjustment ? (
                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <div>
                                        <p className="cbx-kicker">Selected adjustment</p>
                                        <h3 className="mt-2 font-heading text-xl font-semibold text-[var(--cbx-on-surface)]">Adjust {selectedAdjustment.variant?.product?.name}</h3>
                                    </div>
                                    <AdjustmentEditor key={selectedAdjustment.id} adjustment={selectedAdjustment} variants={variants} types={types} sources={sources} />
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardContent>
                            <p className="cbx-kicker">Tracked variants</p>
                            <p className="mt-4 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">{variants.length}</p>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Variants currently available for journal entries.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <p className="cbx-kicker">Active adjustments</p>
                            <p className="mt-4 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">{activeAdjustmentCount}</p>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Adjustments in the current result set that can still be updated or voided.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <p className="cbx-kicker">Low stock alerts</p>
                            <p className="mt-4 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">{lowStockVariants.length}</p>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Variants at three sellable units or fewer.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
