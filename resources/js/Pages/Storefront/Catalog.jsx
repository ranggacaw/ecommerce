import ProductCard from '@/Components/ProductCard';
import SidebarFilter from '@/Components/Storefront/SidebarFilter';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';

export default function Catalog({ products, categories, brands = [], collections = [], filters, activeCategory, activeCollection }) {
    const [form, setForm] = useState({
        q: filters.q || '',
        size: filters.size || '',
        color: filters.color || '',
        brand: filters.brand || '',
        categories: filters.categories || [],
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        sort: filters.sort || '',
        in_stock: Boolean(filters.in_stock),
        collections: filters.collections || [],
    });

    const submit = (event) => {
        event.preventDefault();
        router.get(window.location.pathname, form, { preserveState: true });
    };

    const reset = () => {
        router.get(window.location.pathname, {});
    };

    return (
        <StorefrontLayout title="Shop" categories={categories}>
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--cbx-neutral-mid)]">
                <a href={route('home')} className="hover:text-[var(--cbx-primary)] transition-colors">Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className="font-semibold text-[var(--cbx-on-surface)]">
                    {activeCategory?.name || activeCollection?.name || 'Shop'}
                </span>
            </nav>

            <div className="flex flex-col gap-6 lg:flex-row lg:gap-14">
                {/* Sidebar Filter */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <SidebarFilter
                        form={form}
                        setForm={setForm}
                        submit={submit}
                        reset={reset}
                        collections={collections}
                        categories={categories}
                        brands={brands}
                    />
                </aside>

                {/* Product Canvas */}
                <div className="flex-grow">
                    {/* Toolbar */}
                    <div className="mb-8 flex items-center justify-between border-b border-[var(--cbx-border-subtle)] pb-4">
                        <p className="text-sm text-[var(--cbx-neutral-mid)]">
                            Showing <span className="font-bold text-[var(--cbx-on-surface)]">{products.total}</span> Products
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--cbx-neutral-mid)]">Sort by:</span>
                            <select
                                value={form.sort}
                                onChange={(event) => setForm({ ...form, sort: event.target.value })}
                                className="border-none bg-transparent text-sm text-[var(--cbx-on-surface)] focus:ring-0 cursor-pointer"
                            >
                                <option value="">Featured</option>
                                <option value="latest">Newest Arrival</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {products.data.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            {products.links.map((link, index) => {
                                if (link.label === '...' ) {
                                    return <span key={index} className="px-2 text-[var(--cbx-neutral-mid)]">...</span>;
                                }
                                const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;');
                                const isNext = link.label.includes('Next') || link.label.includes('&raquo;');
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-colors ${
                                            link.active
                                                ? 'border-[var(--cbx-primary)] bg-[var(--cbx-primary)] text-white'
                                                : 'border-[var(--cbx-border-subtle)] text-[var(--cbx-on-surface-variant)] hover:bg-[var(--cbx-surface-container-high)] disabled:opacity-30'
                                        }`}
                                    >
                                        {isPrev ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : link.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
