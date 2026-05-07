import ProductCard from '@/Components/ProductCard';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Catalog({ products, categories, filters, activeCategory, activeCollection }) {
    const [form, setForm] = useState({
        q: filters.q || '',
        size: filters.size || '',
        color: filters.color || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        sort: filters.sort || '',
        in_stock: Boolean(filters.in_stock),
    });

    const submit = (event) => {
        event.preventDefault();
        router.get(window.location.pathname, form, { preserveState: true });
    };

        return (
        <StorefrontLayout title="Shop" categories={categories}>
            <section className="space-y-3">
                <p className="cbx-kicker">Catalog</p>
                <h1 className="font-heading text-4xl font-semibold text-[var(--cbx-on-surface)]">
                    {activeCategory?.name || activeCollection?.name || 'Discover the full collection'}
                </h1>
                <p className="max-w-3xl text-[var(--cbx-on-surface-variant)]">
                    Search by silhouette, narrow by fit or stock, and sort the current assortment around what is ready to ship.
                </p>
            </section>

            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                <Card>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <Input placeholder="Search products" value={form.q} onChange={(event) => setForm({ ...form, q: event.target.value })} />
                            <Input placeholder="Size" value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value })} />
                            <Input placeholder="Color" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} />
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                <Input placeholder="Min price" value={form.min_price} onChange={(event) => setForm({ ...form, min_price: event.target.value })} />
                                <Input placeholder="Max price" value={form.max_price} onChange={(event) => setForm({ ...form, max_price: event.target.value })} />
                            </div>
                            <select value={form.sort} onChange={(event) => setForm({ ...form, sort: event.target.value })} className="cbx-field text-sm">
                                <option value="">Featured</option>
                                <option value="latest">Latest</option>
                                <option value="price_asc">Price: Low to high</option>
                                <option value="price_desc">Price: High to low</option>
                            </select>
                            <label className="flex items-center gap-3 rounded-lg border border-[var(--cbx-outline-variant)] px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">
                                <input type="checkbox" checked={form.in_stock} onChange={(event) => setForm({ ...form, in_stock: event.target.checked })} className="rounded border-[var(--cbx-outline)] text-[var(--cbx-secondary)] focus:ring-[var(--cbx-secondary)]" />
                                Only show in-stock items
                            </label>
                            <div className="flex gap-3">
                                <Button type="submit" className="flex-1">Apply</Button>
                                <Button type="button" variant="secondary" className="flex-1" onClick={() => router.get(window.location.pathname, {})}>Reset</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">{products.data.length} products on this page</p>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {products.data.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {products.links.map((link, index) => (
                            <button
                                key={index}
                                type="button"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                className={`rounded-md border px-4 py-2 text-sm font-medium ${link.active ? 'border-[var(--cbx-primary)] bg-[var(--cbx-primary)] text-white' : 'border-[var(--cbx-outline-variant)] bg-white text-[var(--cbx-on-surface-variant)]'} disabled:opacity-30`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
