import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

const selectClassName = 'cbx-field w-full text-sm';

export default function Inventory({ variants, lowStockVariants, inventoryAdjustments }) {
    const inventoryForm = useForm({
        product_variant_id: variants[0]?.id || '',
        type: 'adjustment',
        source: 'manual',
        quantity: 0,
        notes: '',
    });

    return (
        <AdminLayout title="Inventory" section="inventory">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="grid gap-6">
                    <Card>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="cbx-kicker">Adjustments</p>
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
                                        <Input value={inventoryForm.data.type} onChange={(event) => inventoryForm.setData('type', event.target.value)} placeholder="Type" />
                                        <Input value={inventoryForm.data.source} onChange={(event) => inventoryForm.setData('source', event.target.value)} placeholder="Source" />
                                        <Input value={inventoryForm.data.quantity} onChange={(event) => inventoryForm.setData('quantity', event.target.value)} placeholder="Quantity" />
                                    </div>
                                    <Input value={inventoryForm.data.notes} onChange={(event) => inventoryForm.setData('notes', event.target.value)} placeholder="Notes" />
                                    <Button type="submit">Apply adjustment</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="space-y-4">
                            <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Low stock watchlist</h2>
                            <div className="space-y-3">
                                {lowStockVariants.length === 0 ? (
                                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">No variants currently need replenishment.</p>
                                ) : lowStockVariants.map((variant) => (
                                    <div key={variant.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                        <p className="font-semibold text-[var(--cbx-on-surface)]">{variant.product?.name}</p>
                                        <p>{variant.sku}</p>
                                        <p className="mt-1">Sellable stock: {variant.stock_on_hand - variant.stock_reserved}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="space-y-4">
                        <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Inventory journal</h2>
                        <div className="space-y-3">
                            {inventoryAdjustments.length === 0 ? (
                                <p className="text-sm text-[var(--cbx-on-surface-variant)]">Inventory movements will appear here after the first adjustment.</p>
                            ) : inventoryAdjustments.map((adjustment) => (
                                <div key={adjustment.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{adjustment.variant?.product?.name} · {adjustment.variant?.sku}</p>
                                    <p className="mt-1">{adjustment.type} · {adjustment.quantity} units via {adjustment.source}</p>
                                    <p>{adjustment.user?.name || 'Staff user'}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
