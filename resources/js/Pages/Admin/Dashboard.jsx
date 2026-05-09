import StatCard from '@/Components/StatCard';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';

const selectClassName = 'cbx-field text-sm';

function UpdateProductForm({ product, categories, promotions, collections }) {
    const firstVariant = product.variants?.[0] || {};
    const form = useForm({
        category_id: product.category_id,
        promotion_id: product.promotion_id || '',
        brand: product.brand || '',
        name: product.name,
        short_description: product.short_description || '',
        description: product.description || '',
        material: product.material || '',
        size_chart: product.size_chart || '',
        price: firstVariant.price || product.base_price,
        compare_price: product.compare_price || '',
        sku: firstVariant.sku || '',
        color: firstVariant.color || '',
        size: firstVariant.size || '',
        stock_on_hand: firstVariant.stock_on_hand || 0,
        weight_grams: firstVariant.weight_grams || 0,
        primary_image_url: product.images?.[0]?.url || '',
        secondary_image_url: product.images?.[1]?.url || '',
        collection_ids: product.collections?.map((collection) => collection.id) || [],
        variant_id: firstVariant.id,
    });

    return (
        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.products.update', product.id)); }} className="grid gap-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Product name" />
                <Input value={form.data.brand} onChange={(event) => form.setData('brand', event.target.value)} placeholder="Brand" />
                <Input value={form.data.sku} onChange={(event) => form.setData('sku', event.target.value)} placeholder="SKU" />
                <Input value={form.data.color} onChange={(event) => form.setData('color', event.target.value)} placeholder="Color" />
                <Input value={form.data.size} onChange={(event) => form.setData('size', event.target.value)} placeholder="Size" />
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <select value={form.data.category_id} onChange={(event) => form.setData('category_id', event.target.value)} className={selectClassName}>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <select value={form.data.promotion_id} onChange={(event) => form.setData('promotion_id', event.target.value)} className={selectClassName}>
                    <option value="">No promotion</option>
                    {promotions.map((promotion) => <option key={promotion.id} value={promotion.id}>{promotion.name}</option>)}
                </select>
                <Input value={form.data.price} onChange={(event) => form.setData('price', event.target.value)} placeholder="Price" />
                <Input value={form.data.stock_on_hand} onChange={(event) => form.setData('stock_on_hand', event.target.value)} placeholder="Stock" />
                <Input value={form.data.weight_grams} onChange={(event) => form.setData('weight_grams', event.target.value)} placeholder="Weight" />
            </div>
            <Textarea value={form.data.short_description} onChange={(event) => form.setData('short_description', event.target.value)} placeholder="Short description" className="min-h-20" />
            <div className="flex flex-wrap gap-3">
                {collections.map((collection) => (
                    <label key={collection.id} className="text-sm text-[var(--cbx-on-surface-variant)]">
                        <input
                            type="checkbox"
                            checked={form.data.collection_ids.includes(collection.id)}
                            onChange={(event) => form.setData('collection_ids', event.target.checked ? [...form.data.collection_ids, collection.id] : form.data.collection_ids.filter((id) => id !== collection.id))}
                            className="mr-2"
                        />
                        {collection.name}
                    </label>
                ))}
            </div>
            <Button type="submit" variant="secondary">Update product</Button>
        </form>
    );
}

export default function Dashboard({ stats, products, categories, collections, banners, promotions, orders, inventoryAdjustments }) {
    const productForm = useForm({ category_id: categories[0]?.id || '', promotion_id: '', brand: '', name: '', short_description: '', description: '', material: '', size_chart: '', price: '', compare_price: '', sku: '', color: '', size: '', stock_on_hand: 0, weight_grams: 0, primary_image_url: '', secondary_image_url: '', collection_ids: [] });
    const categoryForm = useForm({ name: '', description: '', type: '' });
    const collectionForm = useForm({ name: '', kind: 'editorial', description: '' });
    const bannerForm = useForm({ title: '', subtitle: '', image_url: '', cta_label: '', cta_href: '', sort_order: 0 });
    const promoForm = useForm({ name: '', code: '', description: '', discount_type: 'percentage', discount_value: 0 });
    const inventoryForm = useForm({ product_variant_id: products[0]?.variants?.[0]?.id || '', type: 'adjustment', source: 'manual', quantity: 0, notes: '' });

    return (
        <AdminLayout title="Commerce operations hub">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Products" value={stats.products} />
                <StatCard label="Variants" value={stats.variants} />
                <StatCard label="Orders" value={stats.orders} />
                <StatCard label="Low stock" value={stats.lowStock} help="Variants at three sellable units or fewer." />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardContent className="space-y-4">
                        <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Add product</h2>
                        <form onSubmit={(event) => { event.preventDefault(); productForm.post(route('admin.products.store')); }} className="space-y-4">
                            <div className="grid gap-3 md:grid-cols-2">
                                <select value={productForm.data.category_id} onChange={(event) => productForm.setData('category_id', event.target.value)} className={selectClassName}>
                                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                </select>
                                <select value={productForm.data.promotion_id} onChange={(event) => productForm.setData('promotion_id', event.target.value)} className={selectClassName}>
                                    <option value="">No promotion</option>
                                    {promotions.map((promotion) => <option key={promotion.id} value={promotion.id}>{promotion.name}</option>)}
                                </select>
                            </div>
                            <Input value={productForm.data.brand} onChange={(event) => productForm.setData('brand', event.target.value)} placeholder="Brand" />
                            <Input value={productForm.data.name} onChange={(event) => productForm.setData('name', event.target.value)} placeholder="Product name" />
                            <Textarea value={productForm.data.short_description} onChange={(event) => productForm.setData('short_description', event.target.value)} placeholder="Short description" className="min-h-20" />
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                <Input value={productForm.data.sku} onChange={(event) => productForm.setData('sku', event.target.value)} placeholder="SKU" />
                                <Input value={productForm.data.color} onChange={(event) => productForm.setData('color', event.target.value)} placeholder="Color" />
                                <Input value={productForm.data.size} onChange={(event) => productForm.setData('size', event.target.value)} placeholder="Size" />
                                <Input value={productForm.data.price} onChange={(event) => productForm.setData('price', event.target.value)} placeholder="Price" />
                            </div>
                            <div className="grid gap-3 md:grid-cols-3">
                                <Input value={productForm.data.stock_on_hand} onChange={(event) => productForm.setData('stock_on_hand', event.target.value)} placeholder="Stock on hand" />
                                <Input value={productForm.data.weight_grams} onChange={(event) => productForm.setData('weight_grams', event.target.value)} placeholder="Weight grams" />
                                <Input value={productForm.data.material} onChange={(event) => productForm.setData('material', event.target.value)} placeholder="Material" />
                            </div>
                            <Input value={productForm.data.primary_image_url} onChange={(event) => productForm.setData('primary_image_url', event.target.value)} placeholder="Primary image URL" />
                            <Input value={productForm.data.secondary_image_url} onChange={(event) => productForm.setData('secondary_image_url', event.target.value)} placeholder="Secondary image URL" />
                            <div className="flex flex-wrap gap-3">
                                {collections.map((collection) => (
                                    <label key={collection.id} className="text-sm text-[var(--cbx-on-surface-variant)]">
                                        <input type="checkbox" checked={productForm.data.collection_ids.includes(collection.id)} onChange={(event) => productForm.setData('collection_ids', event.target.checked ? [...productForm.data.collection_ids, collection.id] : productForm.data.collection_ids.filter((id) => id !== collection.id))} className="mr-2" />
                                        {collection.name}
                                    </label>
                                ))}
                            </div>
                            <Button type="submit">Create product</Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card>
                        <CardContent className="space-y-4">
                            <h2 className="font-heading text-xl font-semibold text-[var(--cbx-on-surface)]">CMS quick actions</h2>
                            <div className="grid gap-4 xl:grid-cols-2">
                                <form onSubmit={(event) => { event.preventDefault(); categoryForm.post(route('admin.categories.store')); }} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-medium text-[var(--cbx-on-surface)]">New category</p>
                                    <Input value={categoryForm.data.name} onChange={(event) => categoryForm.setData('name', event.target.value)} placeholder="Name" />
                                    <Input value={categoryForm.data.type} onChange={(event) => categoryForm.setData('type', event.target.value)} placeholder="Type" />
                                    <Button type="submit" variant="secondary">Save</Button>
                                </form>
                                <form onSubmit={(event) => { event.preventDefault(); collectionForm.post(route('admin.collections.store')); }} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-medium text-[var(--cbx-on-surface)]">New collection</p>
                                    <Input value={collectionForm.data.name} onChange={(event) => collectionForm.setData('name', event.target.value)} placeholder="Name" />
                                    <Input value={collectionForm.data.kind} onChange={(event) => collectionForm.setData('kind', event.target.value)} placeholder="Kind" />
                                    <Button type="submit" variant="secondary">Save</Button>
                                </form>
                                <form onSubmit={(event) => { event.preventDefault(); bannerForm.post(route('admin.banners.store')); }} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-medium text-[var(--cbx-on-surface)]">Hero banner</p>
                                    <Input value={bannerForm.data.title} onChange={(event) => bannerForm.setData('title', event.target.value)} placeholder="Title" />
                                    <Input value={bannerForm.data.image_url} onChange={(event) => bannerForm.setData('image_url', event.target.value)} placeholder="Image URL" />
                                    <Button type="submit" variant="secondary">Save</Button>
                                </form>
                                <form onSubmit={(event) => { event.preventDefault(); promoForm.post(route('admin.promotions.store')); }} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-medium text-[var(--cbx-on-surface)]">Promotion</p>
                                    <Input value={promoForm.data.name} onChange={(event) => promoForm.setData('name', event.target.value)} placeholder="Name" />
                                    <Input value={promoForm.data.code} onChange={(event) => promoForm.setData('code', event.target.value)} placeholder="Code" />
                                    <Button type="submit" variant="secondary">Save</Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="space-y-4">
                            <h2 className="font-heading text-xl font-semibold text-[var(--cbx-on-surface)]">Inventory adjustment</h2>
                            <form onSubmit={(event) => { event.preventDefault(); inventoryForm.post(route('admin.inventory.adjustments.store')); }} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                                <select value={inventoryForm.data.product_variant_id} onChange={(event) => inventoryForm.setData('product_variant_id', event.target.value)} className={`${selectClassName} xl:col-span-2`}>
                                    {products.flatMap((product) => product.variants || []).map((variant) => (
                                        <option key={variant.id} value={variant.id}>{variant.sku} · {variant.color} / {variant.size}</option>
                                    ))}
                                </select>
                                <Input value={inventoryForm.data.type} onChange={(event) => inventoryForm.setData('type', event.target.value)} placeholder="Type" />
                                <Input value={inventoryForm.data.source} onChange={(event) => inventoryForm.setData('source', event.target.value)} placeholder="Source" />
                                <Input value={inventoryForm.data.quantity} onChange={(event) => inventoryForm.setData('quantity', event.target.value)} placeholder="Qty" />
                                <Button type="submit" variant="secondary">Apply</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardContent className="space-y-5">
                    <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Catalog maintenance</h2>
                    <div className="space-y-4">
                        {products.map((product) => (
                            <UpdateProductForm key={product.id} product={product} categories={categories} promotions={promotions} collections={collections} />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardContent className="space-y-4">
                        <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Recent orders</h2>
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-semibold text-[var(--cbx-on-surface)]">{order.number}</p>
                                        <p className="text-sm text-[var(--cbx-neutral-mid)]">{formatCurrency(order.grand_total)} · {order.payment_status} · {order.fulfillment_status}</p>
                                    </div>
                                    <Link href={route('admin.orders.show', order.id)} className="text-sm font-semibold text-[var(--cbx-secondary)]">Process order</Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Inventory journal</h2>
                        <div className="space-y-3">
                            {inventoryAdjustments.map((adjustment) => (
                                <div key={adjustment.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{adjustment.variant?.product?.name} · {adjustment.variant?.sku}</p>
                                    <p className="mt-1">{adjustment.type} · {adjustment.quantity} units via {adjustment.source}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
