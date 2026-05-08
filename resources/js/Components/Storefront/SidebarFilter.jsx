import { Button } from '@/Components/ui/Button';

const COLORS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#212121' },
    { name: 'Red', value: '#b5191e' },
    { name: 'Pink', value: '#FF369C' },
    { name: 'Green', value: '#478947' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function SidebarFilter({ 
    form, 
    setForm, 
    submit, 
    reset, 
    collections = [], 
    categories = [], 
    brands = [] 
}) {
    const handleCollectionChange = (collection) => {
        const current = form.collections || [];
        const updated = current.includes(collection)
            ? current.filter(c => c !== collection)
            : [...current, collection];
        setForm({ ...form, collections: updated });
    };

    const handleCategoryChange = (categoryId) => {
        const current = form.categories || [];
        const updated = current.includes(categoryId)
            ? current.filter(c => c !== categoryId)
            : [...current, categoryId];
        setForm({ ...form, categories: updated });
    };

    return (
        <div className="sticky top-24 space-y-8">
            {/* Collection Filter */}
            {collections.length > 0 && (
                <div>
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--cbx-on-surface)]">Collection</h3>
                    <div className="space-y-2">
                        {collections.map((collection) => (
                            <label key={collection} className="flex cursor-pointer items-center gap-3 group">
                                <input
                                    type="checkbox"
                                    checked={(form.collections || []).includes(collection)}
                                    onChange={() => handleCollectionChange(collection)}
                                    className="h-4 w-4 rounded border-[var(--cbx-outline)] text-[var(--cbx-secondary)] focus:ring-[var(--cbx-secondary)]"
                                />
                                <span className="text-sm text-[var(--cbx-on-surface-variant)] group-hover:text-[var(--cbx-on-surface)] transition-colors">{collection}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories Filter */}
            {categories.length > 0 && (
                <div>
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--cbx-on-surface)]">Category</h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <label key={category.id} className="flex cursor-pointer items-center gap-3 group">
                                <input
                                    type="checkbox"
                                    checked={(form.categories || []).includes(category.id)}
                                    onChange={() => handleCategoryChange(category.id)}
                                    className="h-4 w-4 rounded border-[var(--cbx-outline)] text-[var(--cbx-secondary)] focus:ring-[var(--cbx-secondary)]"
                                />
                                <span className="text-sm text-[var(--cbx-on-surface-variant)] group-hover:text-[var(--cbx-on-surface)] transition-colors">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Brand Filter */}
            {brands.length > 0 && (
                <div>
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--cbx-on-surface)]">Brand</h3>
                    <div className="space-y-2">
                        {brands.map((brand) => (
                            <label key={brand} className="flex cursor-pointer items-center gap-3 group">
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={form.brand === brand}
                                    onChange={() => setForm({ ...form, brand: form.brand === brand ? '' : brand })}
                                    className="h-4 w-4 border-[var(--cbx-outline)] text-[var(--cbx-secondary)] focus:ring-[var(--cbx-secondary)]"
                                />
                                <span className="text-sm text-[var(--cbx-on-surface-variant)] group-hover:text-[var(--cbx-on-surface)] transition-colors">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Size Filter */}
            <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--cbx-on-surface)]">Size</h3>
                <div className="grid grid-cols-5 gap-2">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => setForm({ ...form, size: form.size === size ? '' : size })}
                            className={`py-2 text-sm transition-colors ${
                                form.size === size
                                    ? 'border border-[var(--cbx-primary)] bg-[var(--cbx-primary)] text-white'
                                    : 'border border-[var(--cbx-neutral-light)] text-[var(--cbx-on-surface-variant)] hover:border-[var(--cbx-primary)]'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Filter */}
            <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--cbx-on-surface)]">Color</h3>
                <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                        <button
                            key={color.name}
                            type="button"
                            onClick={() => setForm({ ...form, color: form.color === color.name ? '' : color.name })}
                            className={`h-8 w-8 rounded-full border transition-all ${
                                form.color === color.name ? 'ring-2 ring-[var(--cbx-primary)] ring-offset-2' : 'border-[var(--cbx-neutral-light)]'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--cbx-on-surface)]">Price Range</h3>
                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="1000000"
                        value={form.max_price || 1000000}
                        onChange={(event) => setForm({ ...form, max_price: event.target.value })}
                        className="w-full accent-[var(--cbx-secondary)]"
                    />
                    <div className="flex justify-between text-sm text-[var(--cbx-neutral-mid)]">
                        <span>Rp 0</span>
                        <span>Rp {parseInt(form.max_price || 1000000).toLocaleString('id-ID')}+</span>
                    </div>
                </div>
            </div>

            {/* In Stock Filter */}
            <label className="flex items-center gap-3 text-sm text-[var(--cbx-on-surface-variant)]">
                <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(event) => setForm({ ...form, in_stock: event.target.checked })}
                    className="h-4 w-4 rounded border-[var(--cbx-outline)] text-[var(--cbx-secondary)] focus:ring-[var(--cbx-secondary)]"
                />
                Only show in-stock items
            </label>

            {/* Filter Actions */}
            <div className="flex gap-3">
                <Button type="submit" onClick={submit} className="flex-1">Apply</Button>
                <Button type="button" variant="secondary" className="flex-1" onClick={reset}>Reset</Button>
            </div>
        </div>
    );
}