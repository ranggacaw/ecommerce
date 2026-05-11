import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

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
        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.products.update', product.slug)); }} className="grid gap-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
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

export default function Catalog({ products, categories, collections, promotions }) {
    const productForm = useForm({ category_id: categories[0]?.id || '', promotion_id: '', brand: '', name: '', short_description: '', description: '', material: '', size_chart: '', price: '', compare_price: '', sku: '', color: '', size: '', stock_on_hand: 0, weight_grams: 0, primary_image_url: '', secondary_image_url: '', collection_ids: [] });
    const categoryForm = useForm({ name: '', description: '', type: '' });
    const collectionForm = useForm({ name: '', kind: 'editorial', description: '' });

    return (
        <AdminLayout title="Catalog" section="catalog">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Products</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Add product</h2>
                        </div>
                        {categories.length === 0 ? (
                            <p className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">Create a category first, then return here to add products.</p>
                        ) : (
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
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="cbx-kicker">Taxonomy</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Categories and collections</h2>
                            </div>
                            <div className="grid gap-4 xl:grid-cols-2">
                                <form onSubmit={(event) => { event.preventDefault(); categoryForm.post(route('admin.categories.store')); }} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-medium text-[var(--cbx-on-surface)]">New category</p>
                                    <Input value={categoryForm.data.name} onChange={(event) => categoryForm.setData('name', event.target.value)} placeholder="Name" />
                                    <Input value={categoryForm.data.type} onChange={(event) => categoryForm.setData('type', event.target.value)} placeholder="Type" />
                                    <Textarea value={categoryForm.data.description} onChange={(event) => categoryForm.setData('description', event.target.value)} placeholder="Description" className="min-h-20" />
                                    <Button type="submit" variant="secondary">Save category</Button>
                                </form>
                                <form onSubmit={(event) => { event.preventDefault(); collectionForm.post(route('admin.collections.store')); }} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-medium text-[var(--cbx-on-surface)]">New collection</p>
                                    <Input value={collectionForm.data.name} onChange={(event) => collectionForm.setData('name', event.target.value)} placeholder="Name" />
                                    <Input value={collectionForm.data.kind} onChange={(event) => collectionForm.setData('kind', event.target.value)} placeholder="Kind" />
                                    <Textarea value={collectionForm.data.description} onChange={(event) => collectionForm.setData('description', event.target.value)} placeholder="Description" className="min-h-20" />
                                    <Button type="submit" variant="secondary">Save collection</Button>
                                </form>
                            </div>
                            <div className="grid gap-4 xl:grid-cols-2">
                                <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-medium text-[var(--cbx-on-surface)]">Current categories</p>
                                    <div className="mt-3 space-y-2 text-sm text-[var(--cbx-on-surface-variant)]">
                                        {categories.length === 0 ? <p>No categories yet.</p> : categories.map((category) => <p key={category.id}>{category.name}</p>)}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-medium text-[var(--cbx-on-surface)]">Current collections</p>
                                    <div className="mt-3 space-y-2 text-sm text-[var(--cbx-on-surface-variant)]">
                                        {collections.length === 0 ? <p>No collections yet.</p> : collections.map((collection) => <p key={collection.id}>{collection.name} · {collection.products_count} products</p>)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardContent className="space-y-5">
                    <h2 className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Catalog maintenance</h2>
                    <div className="space-y-4">
                        {products.length === 0 ? (
                            <p className="text-sm text-[var(--cbx-on-surface-variant)]">Products will appear here after the first catalog item is created.</p>
                        ) : products.map((product) => (
                            <UpdateProductForm key={product.id} product={product} categories={categories} promotions={promotions} collections={collections} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
