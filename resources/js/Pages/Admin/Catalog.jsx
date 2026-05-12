import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit3,
    Plus,
    Search,
    Trash2,
    TrendingUp,
    X,
} from 'lucide-react';

const filterSelectClassName = 'cbx-field w-full appearance-none py-2 pl-4 pr-10 text-sm';
const editorSelectClassName = 'cbx-field w-full text-sm';

function getEmptyProductData(categories) {
    return {
        category_id: categories[0]?.id ?? '',
        promotion_id: '',
        brand: '',
        name: '',
        short_description: '',
        description: '',
        material: '',
        size_chart: '',
        price: '',
        compare_price: '',
        sku: '',
        color: '',
        size: '',
        stock_on_hand: 0,
        weight_grams: 0,
        primary_image_url: '',
        secondary_image_url: '',
        collection_ids: [],
        variant_id: null,
        is_active: true,
    };
}

function getProductFormData(product, categories) {
    const firstVariant = product.variants?.[0] ?? {};

    return {
        category_id: product.category_id ?? categories[0]?.id ?? '',
        promotion_id: product.promotion_id ?? '',
        brand: product.brand ?? '',
        name: product.name ?? '',
        short_description: product.short_description ?? '',
        description: product.description ?? '',
        material: product.material ?? '',
        size_chart: product.size_chart ?? '',
        price: firstVariant.price ?? product.base_price ?? '',
        compare_price: product.compare_price ?? '',
        sku: firstVariant.sku ?? '',
        color: firstVariant.color ?? '',
        size: firstVariant.size ?? '',
        stock_on_hand: firstVariant.stock_on_hand ?? 0,
        weight_grams: firstVariant.weight_grams ?? 0,
        primary_image_url: product.images?.[0]?.url ?? '',
        secondary_image_url: product.images?.[1]?.url ?? '',
        collection_ids: product.collections?.map((collection) => collection.id) ?? [],
        variant_id: firstVariant.id ?? null,
        is_active: product.is_active ?? true,
    };
}

function getProductStatus(product) {
    const stock = Number(product.variants?.[0]?.stock_on_hand ?? 0);

    if (!product.is_active) {
        return { label: 'Draft', className: 'bg-[var(--cbx-surface-container-low)] text-[var(--cbx-on-surface-variant)]' };
    }

    if (stock <= 0) {
        return { label: 'Out of stock', className: 'bg-[var(--cbx-error-container)] text-[var(--cbx-error)]' };
    }

    return { label: 'Active', className: 'bg-[rgba(71,137,71,0.12)] text-[var(--cbx-brand-green)]' };
}

function formatCurrency(value) {
    return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
}

function formatCompactCurrency(value) {
    const amount = Number(value || 0);

    if (amount >= 1000000000) {
        return `Rp ${(amount / 1000000000).toFixed(1)}B`;
    }

    if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1)}M`;
    }

    return formatCurrency(amount);
}

function ProductEditor({
    form,
    categories,
    promotions,
    collections,
    submitLabel,
    title,
    onSubmit,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/35">
            <div className="h-full w-full max-w-2xl overflow-y-auto bg-[var(--cbx-surface-container-lowest)] p-6 shadow-2xl">
                <div className="mb-6 flex items-start justify-between gap-4 border-b border-[var(--cbx-border-subtle)] pb-4">
                    <div>
                        <p className="cbx-kicker">Product editor</p>
                        <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--cbx-on-surface-variant)] transition-colors hover:bg-[var(--cbx-surface-container-low)] hover:text-[var(--cbx-on-surface)]"
                    >
                        <X size={18} />
                        <span className="sr-only">Close product editor</span>
                    </button>
                </div>

                {categories.length === 0 ? (
                    <p className="rounded-lg border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                        Create a category first, then return here to add products.
                    </p>
                ) : (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            onSubmit();
                        }}
                        className="space-y-5"
                    >
                        <div className="grid gap-3 md:grid-cols-2">
                            <select
                                value={form.data.category_id}
                                onChange={(event) => form.setData('category_id', event.target.value)}
                                className={editorSelectClassName}
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            <select
                                value={form.data.promotion_id}
                                onChange={(event) => form.setData('promotion_id', event.target.value)}
                                className={editorSelectClassName}
                            >
                                <option value="">No promotion</option>
                                {promotions.map((promotion) => (
                                    <option key={promotion.id} value={promotion.id}>{promotion.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <Input value={form.data.brand} onChange={(event) => form.setData('brand', event.target.value)} placeholder="Brand" />
                            <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Product name" />
                        </div>

                        <Textarea
                            value={form.data.short_description}
                            onChange={(event) => form.setData('short_description', event.target.value)}
                            placeholder="Short description"
                            className="min-h-24"
                        />

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <Input value={form.data.sku} onChange={(event) => form.setData('sku', event.target.value)} placeholder="SKU" />
                            <Input value={form.data.color} onChange={(event) => form.setData('color', event.target.value)} placeholder="Color" />
                            <Input value={form.data.size} onChange={(event) => form.setData('size', event.target.value)} placeholder="Size" />
                            <Input type="number" min="0" value={form.data.price} onChange={(event) => form.setData('price', event.target.value)} placeholder="Price" />
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            <Input type="number" min="0" value={form.data.stock_on_hand} onChange={(event) => form.setData('stock_on_hand', event.target.value)} placeholder="Stock on hand" />
                            <Input type="number" min="0" value={form.data.weight_grams} onChange={(event) => form.setData('weight_grams', event.target.value)} placeholder="Weight grams" />
                            <Input value={form.data.material} onChange={(event) => form.setData('material', event.target.value)} placeholder="Material" />
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <Input value={form.data.primary_image_url} onChange={(event) => form.setData('primary_image_url', event.target.value)} placeholder="Primary image URL" />
                            <Input value={form.data.secondary_image_url} onChange={(event) => form.setData('secondary_image_url', event.target.value)} placeholder="Secondary image URL" />
                        </div>

                        <label className="flex items-center gap-3 rounded-lg border border-[var(--cbx-border-subtle)] px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(event) => form.setData('is_active', event.target.checked)}
                            />
                            <span>Active on storefront</span>
                        </label>

                        <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                            <p className="cbx-kicker text-[var(--cbx-on-surface)]">Collections</p>
                            <div className="flex flex-wrap gap-3">
                                {collections.length === 0 ? (
                                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">No collections available yet.</p>
                                ) : collections.map((collection) => (
                                    <label key={collection.id} className="inline-flex items-center gap-2 rounded-full border border-[var(--cbx-border-subtle)] px-3 py-2 text-sm text-[var(--cbx-on-surface-variant)]">
                                        <input
                                            type="checkbox"
                                            checked={form.data.collection_ids.includes(collection.id)}
                                            onChange={(event) => {
                                                form.setData(
                                                    'collection_ids',
                                                    event.target.checked
                                                        ? [...form.data.collection_ids, collection.id]
                                                        : form.data.collection_ids.filter((id) => id !== collection.id),
                                                );
                                            }}
                                        />
                                        <span>{collection.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button type="submit" disabled={form.processing}>{submitLabel}</Button>
                            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function TaxonomyForm({ title, children }) {
    return (
        <div className="space-y-4 rounded-xl border border-[var(--cbx-border-subtle)] p-5">
            <div>
                <p className="cbx-kicker text-[var(--cbx-on-surface)]">Taxonomy</p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-[var(--cbx-on-surface)]">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function CategoryEditor({ category }) {
    const form = useForm({
        name: category.name,
        type: category.type ?? '',
        description: category.description ?? '',
    });

    const destroyCategory = () => {
        if (!window.confirm(`Delete category "${category.name}"? Products will remain in the catalog without a category.`)) {
            return;
        }

        form.delete(route('admin.categories.destroy', category.slug), { preserveScroll: true });
    };

    return (
        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.categories.update', category.slug), { preserveScroll: true }); }} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
            <div className="grid gap-3 md:grid-cols-2">
                <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Category name" />
                <Input value={form.data.type} onChange={(event) => form.setData('type', event.target.value)} placeholder="Category type" />
            </div>
            <Textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} placeholder="Category description" className="min-h-20" />
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--cbx-on-surface-variant)]">
                <span>{category.products_count} products assigned</span>
                <div className="flex gap-2">
                    <Button type="submit" variant="secondary" size="sm">Update</Button>
                    <Button type="button" variant="danger" size="sm" onClick={destroyCategory}>Delete</Button>
                </div>
            </div>
        </form>
    );
}

function CollectionEditor({ collection }) {
    const form = useForm({
        name: collection.name,
        kind: collection.kind,
        description: collection.description ?? '',
    });

    const destroyCollection = () => {
        if (!window.confirm(`Delete collection "${collection.name}"? Product assignments will be detached.`)) {
            return;
        }

        form.delete(route('admin.collections.destroy', collection.slug), { preserveScroll: true });
    };

    return (
        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.collections.update', collection.slug), { preserveScroll: true }); }} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
            <div className="grid gap-3 md:grid-cols-2">
                <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Collection name" />
                <Input value={form.data.kind} onChange={(event) => form.setData('kind', event.target.value)} placeholder="Collection kind" />
            </div>
            <Textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} placeholder="Collection description" className="min-h-20" />
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--cbx-on-surface-variant)]">
                <span>{collection.products_count} products assigned</span>
                <div className="flex gap-2">
                    <Button type="submit" variant="secondary" size="sm">Update</Button>
                    <Button type="button" variant="danger" size="sm" onClick={destroyCollection}>Delete</Button>
                </div>
            </div>
        </form>
    );
}

export default function Catalog({ products, categories, collections, promotions, filters }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [panelMode, setPanelMode] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? null);
    const [selectedCollectionId, setSelectedCollectionId] = useState(collections[0]?.id ?? null);

    const createForm = useForm(getEmptyProductData(categories));
    const editForm = useForm(getEmptyProductData(categories));
    const categoryForm = useForm({ name: '', description: '', type: '' });
    const collectionForm = useForm({ name: '', kind: 'editorial', description: '' });
    const deleteForm = useForm({});

    const itemsPerPage = 8;

    const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedProducts = products.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const metrics = useMemo(() => {
        const totalStockValue = products.reduce((sum, product) => {
            const variant = product.variants?.[0] ?? {};

            return sum + (Number(variant.price) || 0) * (Number(variant.stock_on_hand) || 0);
        }, 0);

        const lowStockCount = products.filter((product) => {
            const stock = Number(product.variants?.[0]?.stock_on_hand ?? 0);

            return product.is_active && stock > 0 && stock <= 10;
        }).length;

        const categoryTotals = products.reduce((carry, product) => {
            const key = product.category?.name || 'Uncategorized';

            carry[key] = (carry[key] || 0) + 1;

            return carry;
        }, {});

        const bestCategory = Object.entries(categoryTotals).sort((left, right) => right[1] - left[1])[0];

        return {
            totalStockValue,
            lowStockCount,
            bestCategoryLabel: bestCategory?.[0] || 'No category',
            bestCategoryCount: bestCategory?.[1] || 0,
        };
    }, [products]);

    const openCreatePanel = () => {
        createForm.setData(getEmptyProductData(categories));
        setSelectedProduct(null);
        setPanelMode('create');
    };

    const openEditPanel = (product) => {
        editForm.setData(getProductFormData(product, categories));
        setSelectedProduct(product);
        setPanelMode('edit');
    };

    const closePanel = () => {
        setPanelMode(null);
        setSelectedProduct(null);
    };

    const submitCreate = () => {
        createForm.post(route('admin.products.store'), {
            preserveScroll: true,
            onSuccess: () => {
                createForm.setData(getEmptyProductData(categories));
                closePanel();
            },
        });
    };

    const submitEdit = () => {
        if (!selectedProduct) {
            return;
        }

        editForm.patch(route('admin.products.update', selectedProduct.slug), {
            preserveScroll: true,
            onSuccess: () => {
                closePanel();
            },
        });
    };

    const deleteProduct = (product) => {
        if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) {
            return;
        }

        deleteForm.delete(route('admin.products.destroy', product.slug), {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedProduct?.id === product.id) {
                    closePanel();
                }
            },
        });
    };

    const visiblePages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);
    const selectedCategory = categories.find((category) => category.id === selectedCategoryId) ?? categories[0] ?? null;
    const selectedCollection = collections.find((collection) => collection.id === selectedCollectionId) ?? collections[0] ?? null;

    return (
        <AdminLayout
            title="Products"
            section="catalog"
            description="Manage inventory, pricing, category placement, and product publishing from one workspace."
            toolbarSearchValue={filters.q}
            toolbarSearchAction={route('admin.catalog')}
            toolbarSearchPlaceholder="Search products, SKUs, or categories..."
            actions={
                <Button type="button" className="gap-2" onClick={openCreatePanel}>
                    <Plus size={16} />
                    <span>Add New Product</span>
                </Button>
            }
        >
            {panelMode === 'create' ? (
                <ProductEditor
                    form={createForm}
                    categories={categories}
                    promotions={promotions}
                    collections={collections}
                    title="Add new product"
                    submitLabel="Create product"
                    onSubmit={submitCreate}
                    onClose={closePanel}
                />
            ) : null}

            {panelMode === 'edit' && selectedProduct ? (
                <ProductEditor
                    form={editForm}
                    categories={categories}
                    promotions={promotions}
                    collections={collections}
                    title={`Edit ${selectedProduct.name}`}
                    submitLabel="Update product"
                    onSubmit={submitEdit}
                    onClose={closePanel}
                />
            ) : null}

            <div className="space-y-8">
                <div className="rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-4">
                    <form action={route('admin.catalog')} method="get" className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cbx-on-surface-variant)]" />
                            <input
                                name="q"
                                defaultValue={filters.q}
                                placeholder="Filter by name, brand, SKU, or category"
                                className="cbx-field py-2 pl-10 pr-4 text-sm"
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:w-auto">
                            <div className="relative min-w-[180px]">
                                <select
                                    name="category"
                                    defaultValue={filters.category}
                                    className={filterSelectClassName}
                                >
                                    <option value="all">Category: All</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative min-w-[180px]">
                                <select
                                    name="status"
                                    defaultValue={filters.status}
                                    className={filterSelectClassName}
                                >
                                    <option value="all">Status: All</option>
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="out_of_stock">Out of stock</option>
                                </select>
                            </div>
                            <Button type="submit" variant="secondary">Apply</Button>
                            <Link href={route('admin.catalog')} className="inline-flex items-center justify-center rounded-lg border border-[var(--cbx-outline-variant)] px-4 py-2 text-sm font-semibold text-[var(--cbx-on-surface)] transition-colors hover:bg-[var(--cbx-surface-container-low)]">Reset</Link>
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Image</th>
                                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Product Name</th>
                                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Category</th>
                                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Price</th>
                                    <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Stock</th>
                                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Status</th>
                                    <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-14 text-center text-sm text-[var(--cbx-on-surface-variant)]">
                                            No products match the current filters.
                                        </td>
                                    </tr>
                                ) : paginatedProducts.map((product) => {
                                    const variant = product.variants?.[0] ?? {};
                                    const status = getProductStatus(product);
                                    const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=120&h=120&fit=crop';

                                    return (
                                        <tr key={product.id} className="border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)]">
                                            <td className="px-4 py-3">
                                                <div className="h-12 w-12 overflow-hidden rounded-lg bg-[var(--cbx-neutral-light)]">
                                                    <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-[var(--cbx-primary)]">{product.name}</div>
                                                <div className="text-[10px] text-[var(--cbx-on-surface-variant)]">SKU: {variant.sku || 'No SKU'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface)]">{product.category?.name || 'Uncategorized'}</td>
                                            <td className="px-4 py-3 font-heading text-lg font-bold text-[var(--cbx-primary)]">{formatCurrency(variant.price || product.base_price)}</td>
                                            <td className="px-4 py-3 text-center text-sm text-[var(--cbx-on-surface)]">{Number(variant.stock_on_hand || 0)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.05em] ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditPanel(product)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--cbx-on-surface-variant)] transition-colors hover:bg-[var(--cbx-surface-container-low)] hover:text-[var(--cbx-on-surface)]"
                                                    >
                                                        <Edit3 size={16} />
                                                        <span className="sr-only">Edit {product.name}</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteProduct(product)}
                                                        disabled={deleteForm.processing}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--cbx-on-surface-variant)] transition-colors hover:bg-[var(--cbx-error-container)] hover:text-[var(--cbx-error)] disabled:opacity-50"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span className="sr-only">Delete {product.name}</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-4 p-4 lg:hidden">
                        {paginatedProducts.length === 0 ? (
                            <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                No products match the current filters.
                            </p>
                        ) : paginatedProducts.map((product) => {
                            const variant = product.variants?.[0] ?? {};
                            const status = getProductStatus(product);
                            const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=120&h=120&fit=crop';

                            return (
                                <div key={product.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <div className="flex gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--cbx-neutral-light)]">
                                            <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-[var(--cbx-primary)]">{product.name}</p>
                                                    <p className="text-xs text-[var(--cbx-on-surface-variant)]">SKU: {variant.sku || 'No SKU'}</p>
                                                </div>
                                                <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.05em] ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="mt-3 grid gap-1 text-sm text-[var(--cbx-on-surface-variant)]">
                                                <p>Category: {product.category?.name || 'Uncategorized'}</p>
                                                <p>Price: {formatCurrency(variant.price || product.base_price)}</p>
                                                <p>Stock: {Number(variant.stock_on_hand || 0)}</p>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <Button type="button" variant="secondary" size="sm" className="gap-2" onClick={() => openEditPanel(product)}>
                                                    <Edit3 size={14} />
                                                    <span>Edit</span>
                                                </Button>
                                                <Button type="button" variant="danger" size="sm" className="gap-2" onClick={() => deleteProduct(product)} disabled={deleteForm.processing}>
                                                    <Trash2 size={14} />
                                                    <span>Delete</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-4 border-t border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-[var(--cbx-on-surface-variant)]">
                            Showing {products.length === 0 ? 0 : ((safeCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(safeCurrentPage * itemsPerPage, products.length)} of {products.length} results
                        </p>
                        <div className="flex items-center gap-1 self-end sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                disabled={safeCurrentPage === 1}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--cbx-on-surface-variant)] transition-colors hover:bg-[var(--cbx-neutral-light)] disabled:opacity-40"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {visiblePages.map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={[
                                        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors',
                                        page === safeCurrentPage
                                            ? 'bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)]'
                                            : 'text-[var(--cbx-on-surface-variant)] hover:bg-[var(--cbx-neutral-light)]',
                                    ].join(' ')}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                disabled={safeCurrentPage === totalPages}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--cbx-on-surface-variant)] transition-colors hover:bg-[var(--cbx-neutral-light)] disabled:opacity-40"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="flex min-h-[152px] flex-col justify-between rounded-xl bg-[var(--cbx-primary)] p-6 text-[var(--cbx-on-primary)]">
                        <span className="text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-primary)]/60">Total stock value</span>
                        <h3 className="mt-3 font-heading text-4xl font-bold">{formatCompactCurrency(metrics.totalStockValue)}</h3>
                        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--cbx-brand-green)]">
                            <TrendingUp size={16} />
                            <span>{products.length} products in catalog</span>
                        </div>
                    </div>

                    <div className="flex min-h-[152px] flex-col justify-between rounded-xl bg-[var(--cbx-secondary)] p-6 text-white">
                        <span className="text-xs font-bold uppercase tracking-[0.05em] text-white/70">Low stock alerts</span>
                        <h3 className="mt-3 font-heading text-4xl font-bold">{metrics.lowStockCount} Items</h3>
                        <p className="mt-4 text-sm text-white/80">Review variants at ten units or fewer.</p>
                    </div>

                    <div className="flex min-h-[152px] flex-col justify-between rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-6">
                        <span className="text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Best selling category</span>
                        <h3 className="mt-3 font-heading text-4xl font-bold text-[var(--cbx-primary)]">{metrics.bestCategoryLabel}</h3>
                        <p className="mt-4 text-sm text-[var(--cbx-on-surface-variant)]">{metrics.bestCategoryCount} products currently assigned.</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="cbx-kicker">Taxonomy</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Categories and collections</h2>
                            <p className="mt-2 max-w-2xl text-sm text-[var(--cbx-on-surface-variant)]">
                                Keep product grouping accurate so storefront browsing, promotions, and collection pages stay clean.
                            </p>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-2">
                            <TaxonomyForm title="Category workspace">
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        categoryForm.post(route('admin.categories.store'), {
                                            preserveScroll: true,
                                            onSuccess: () => categoryForm.reset(),
                                        });
                                    }}
                                    className="space-y-3"
                                >
                                    <Input value={categoryForm.data.name} onChange={(event) => categoryForm.setData('name', event.target.value)} placeholder="Category name" />
                                    <Input value={categoryForm.data.type} onChange={(event) => categoryForm.setData('type', event.target.value)} placeholder="Category type" />
                                    <Textarea value={categoryForm.data.description} onChange={(event) => categoryForm.setData('description', event.target.value)} placeholder="Category description" className="min-h-24" />
                                    <Button type="submit" variant="secondary" disabled={categoryForm.processing}>Save category</Button>
                                </form>

                                <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">Current categories</p>
                                    <div className="mt-3 overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                                        <div className="hidden overflow-x-auto lg:block">
                                            <table className="w-full min-w-[520px] border-collapse text-left">
                                                <thead>
                                                    <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Category</th>
                                                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Type</th>
                                                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Products</th>
                                                        <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {categories.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className="px-6 py-10 text-center text-sm text-[var(--cbx-on-surface-variant)]">No categories yet.</td>
                                                        </tr>
                                                    ) : categories.map((category) => {
                                                        const isSelected = selectedCategory?.id === category.id;

                                                        return (
                                                            <tr key={category.id} className={`border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)] ${isSelected ? 'bg-[var(--cbx-surface-alt)]' : ''}`}>
                                                                <td className="px-4 py-3 font-semibold text-[var(--cbx-on-surface)]">{category.name}</td>
                                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{category.type || 'No type'}</td>
                                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface)]">{category.products_count}</td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedCategoryId(category.id)}>Edit</Button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="space-y-4 p-4 lg:hidden">
                                            {categories.length === 0 ? (
                                                <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">No categories yet.</p>
                                            ) : categories.map((category) => (
                                                <div key={category.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{category.name}</p>
                                                    <div className="mt-2 grid gap-1 text-sm text-[var(--cbx-on-surface-variant)]">
                                                        <p>Type: {category.type || 'No type'}</p>
                                                        <p>Products: {category.products_count}</p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedCategoryId(category.id)}>Edit</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedCategory ? <CategoryEditor key={selectedCategory.id} category={selectedCategory} /> : null}
                                </div>
                            </TaxonomyForm>

                            <TaxonomyForm title="Collection workspace">
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        collectionForm.post(route('admin.collections.store'), {
                                            preserveScroll: true,
                                            onSuccess: () => collectionForm.reset('name', 'description'),
                                        });
                                    }}
                                    className="space-y-3"
                                >
                                    <Input value={collectionForm.data.name} onChange={(event) => collectionForm.setData('name', event.target.value)} placeholder="Collection name" />
                                    <Input value={collectionForm.data.kind} onChange={(event) => collectionForm.setData('kind', event.target.value)} placeholder="Collection kind" />
                                    <Textarea value={collectionForm.data.description} onChange={(event) => collectionForm.setData('description', event.target.value)} placeholder="Collection description" className="min-h-24" />
                                    <Button type="submit" variant="secondary" disabled={collectionForm.processing}>Save collection</Button>
                                </form>

                                <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">Current collections</p>
                                    <div className="mt-3 overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                                        <div className="hidden overflow-x-auto lg:block">
                                            <table className="w-full min-w-[520px] border-collapse text-left">
                                                <thead>
                                                    <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Collection</th>
                                                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Kind</th>
                                                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Products</th>
                                                        <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {collections.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className="px-6 py-10 text-center text-sm text-[var(--cbx-on-surface-variant)]">No collections yet.</td>
                                                        </tr>
                                                    ) : collections.map((collection) => {
                                                        const isSelected = selectedCollection?.id === collection.id;

                                                        return (
                                                            <tr key={collection.id} className={`border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)] ${isSelected ? 'bg-[var(--cbx-surface-alt)]' : ''}`}>
                                                                <td className="px-4 py-3 font-semibold text-[var(--cbx-on-surface)]">{collection.name}</td>
                                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{collection.kind || 'No kind'}</td>
                                                                <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface)]">{collection.products_count}</td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedCollectionId(collection.id)}>Edit</Button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="space-y-4 p-4 lg:hidden">
                                            {collections.length === 0 ? (
                                                <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">No collections yet.</p>
                                            ) : collections.map((collection) => (
                                                <div key={collection.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{collection.name}</p>
                                                    <div className="mt-2 grid gap-1 text-sm text-[var(--cbx-on-surface-variant)]">
                                                        <p>Kind: {collection.kind || 'No kind'}</p>
                                                        <p>Products: {collection.products_count}</p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedCollectionId(collection.id)}>Edit</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedCollection ? <CollectionEditor key={selectedCollection.id} collection={selectedCollection} /> : null}
                                </div>
                            </TaxonomyForm>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
