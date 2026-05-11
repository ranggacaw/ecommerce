import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

const selectClassName = 'cbx-field text-sm';

const emptyBanner = {
    title: '',
    subtitle: '',
    image_url: '',
    cta_label: '',
    cta_href: '',
    is_active: true,
    sort_order: 0,
};

const emptyPromotion = {
    name: '',
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    is_active: true,
};

function SectionCard({ kicker, title, children }) {
    return (
        <Card>
            <CardContent className="space-y-4">
                <div>
                    <p className="cbx-kicker">{kicker}</p>
                    <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">{title}</h2>
                </div>
                {children}
            </CardContent>
        </Card>
    );
}

function updateObjectField(form, section, field, value) {
    form.setData('content', {
        ...form.data.content,
        [section]: {
            ...form.data.content[section],
            [field]: value,
        },
    });
}

function updateArrayItem(form, field, index, patch) {
    form.setData('content', {
        ...form.data.content,
        [field]: form.data.content[field].map((item, itemIndex) => (
            itemIndex === index ? { ...item, ...patch } : item
        )),
    });
}

function updateNestedArrayItem(form, section, field, index, patch) {
    form.setData('content', {
        ...form.data.content,
        [section]: {
            ...form.data.content[section],
            [field]: form.data.content[section][field].map((item, itemIndex) => (
                itemIndex === index ? { ...item, ...patch } : item
            )),
        },
    });
}

function updateSimpleArrayItem(form, field, index, value) {
    form.setData('content', {
        ...form.data.content,
        [field]: form.data.content[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
    });
}

function updateNestedSimpleArrayItem(form, section, field, index, value) {
    form.setData('content', {
        ...form.data.content,
        [section]: {
            ...form.data.content[section],
            [field]: form.data.content[section][field].map((item, itemIndex) => (itemIndex === index ? value : item)),
        },
    });
}

function BannerEditor({ banner }) {
    const form = useForm({
        title: banner.title,
        subtitle: banner.subtitle ?? '',
        image_url: banner.image_url,
        cta_label: banner.cta_label ?? '',
        cta_href: banner.cta_href ?? '',
        is_active: banner.is_active,
        sort_order: banner.sort_order,
    });

    const destroyBanner = () => {
        if (! window.confirm(`Delete banner "${banner.title}"?`)) {
            return;
        }

        form.delete(route('admin.banners.destroy', banner.id), { preserveScroll: true });
    };

    return (
        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.banners.update', banner.id), { preserveScroll: true }); }} className="space-y-4 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-semibold text-[var(--cbx-on-surface)]">{banner.title}</p>
                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">Sort order: {banner.sort_order}</p>
                </div>
                <label className="text-sm text-[var(--cbx-on-surface-variant)]">
                    <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="mr-2" />
                    Active on storefront
                </label>
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                <img src={form.data.image_url} alt={form.data.title} className="h-48 w-full object-cover" />
            </div>

            <Input value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} placeholder="Title" />
            <Textarea value={form.data.subtitle} onChange={(event) => form.setData('subtitle', event.target.value)} placeholder="Subtitle" className="min-h-24" />
            <Input value={form.data.image_url} onChange={(event) => form.setData('image_url', event.target.value)} placeholder="Image URL" />
            <div className="grid gap-3 md:grid-cols-2">
                <Input value={form.data.cta_label} onChange={(event) => form.setData('cta_label', event.target.value)} placeholder="CTA label" />
                <Input value={form.data.cta_href} onChange={(event) => form.setData('cta_href', event.target.value)} placeholder="CTA href" />
            </div>
            <Input type="number" min="0" value={form.data.sort_order} onChange={(event) => form.setData('sort_order', event.target.value)} placeholder="Sort order" />

            <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="secondary">Update banner</Button>
                <Button type="button" variant="danger" onClick={destroyBanner}>Delete banner</Button>
            </div>
        </form>
    );
}

function PromotionEditor({ promotion }) {
    const form = useForm({
        name: promotion.name,
        code: promotion.code ?? '',
        description: promotion.description ?? '',
        discount_type: promotion.discount_type,
        discount_value: promotion.discount_value,
        is_active: promotion.is_active,
    });

    const destroyPromotion = () => {
        if (! window.confirm(`Delete promotion "${promotion.name}"?`)) {
            return;
        }

        form.delete(route('admin.promotions.destroy', promotion.id), { preserveScroll: true });
    };

    return (
        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.promotions.update', promotion.id), { preserveScroll: true }); }} className="space-y-4 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-semibold text-[var(--cbx-on-surface)]">{promotion.name}</p>
                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">{promotion.code || 'No code'}</p>
                </div>
                <label className="text-sm text-[var(--cbx-on-surface-variant)]">
                    <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="mr-2" />
                    Active on storefront
                </label>
            </div>

            <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Name" />
            <Input value={form.data.code} onChange={(event) => form.setData('code', event.target.value)} placeholder="Code" />
            <Textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} placeholder="Description" className="min-h-24" />
            <div className="grid gap-3 md:grid-cols-2">
                <select value={form.data.discount_type} onChange={(event) => form.setData('discount_type', event.target.value)} className={selectClassName}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                </select>
                <Input type="number" min="0" step="0.01" value={form.data.discount_value} onChange={(event) => form.setData('discount_value', event.target.value)} placeholder="Discount value" />
            </div>

            <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="secondary">Update promotion</Button>
                <Button type="button" variant="danger" onClick={destroyPromotion}>Delete promotion</Button>
            </div>
        </form>
    );
}

export default function Merchandising({ banners, homepageContent, promotions, storefrontContent }) {
    const bannerForm = useForm(emptyBanner);
    const promoForm = useForm(emptyPromotion);
    const heroForm = useForm({ section: 'hero', hero: homepageContent.hero });
    const supportCardsForm = useForm({ section: 'support_cards', support_cards: homepageContent.support_cards });
    const flashSaleForm = useForm({ section: 'flash_sale', flash_sale: homepageContent.flash_sale });
    const categoryDiscoveryForm = useForm({ section: 'category_discovery', category_discovery: homepageContent.category_discovery });
    const newArrivalsForm = useForm({ section: 'new_arrivals', new_arrivals: homepageContent.new_arrivals });
    const editorialForm = useForm({ section: 'editorial', editorial: homepageContent.editorial });
    const featuredProductsForm = useForm({ section: 'featured_products', featured_products: homepageContent.featured_products });
    const shellForm = useForm({ key: 'shell', content: storefrontContent.shell });
    const aboutForm = useForm({ key: 'about', content: storefrontContent.about });
    const contactForm = useForm({ key: 'contact', content: storefrontContent.contact });
    const termsForm = useForm({ key: 'terms', content: storefrontContent.terms });
    const privacyForm = useForm({ key: 'privacy', content: storefrontContent.privacy });

    const updateSupportCard = (index, field, value) => {
        supportCardsForm.setData('support_cards', supportCardsForm.data.support_cards.map((card, cardIndex) => (
            cardIndex === index ? { ...card, [field]: value } : card
        )));
    };

    const submitStorefrontSection = (form) => {
        form.patch(route('admin.storefront-content.update'));
    };

    return (
        <AdminLayout title="Merchandising" section="merchandising">
            <div className="space-y-10">
                <section className="space-y-6">
                    <div>
                        <p className="cbx-kicker">Quick edit</p>
                        <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">About hero image</h1>
                        <p className="mt-2 max-w-2xl text-sm text-[var(--cbx-on-surface-variant)]">
                            Update the main About page image here without digging through the full page-content form.
                        </p>
                    </div>

                    <SectionCard kicker="About page" title="Hero image and alt text">
                        <form onSubmit={(event) => { event.preventDefault(); submitStorefrontSection(aboutForm); }} className="space-y-4">
                            <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                <img
                                    src={aboutForm.data.content.hero.image_url}
                                    alt={aboutForm.data.content.hero.image_alt}
                                    className="h-64 w-full object-cover"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="cbx-kicker text-[var(--cbx-on-surface)]">Hero image URL</p>
                                <Input
                                    value={aboutForm.data.content.hero.image_url}
                                    onChange={(event) => updateObjectField(aboutForm, 'hero', 'image_url', event.target.value)}
                                    placeholder="Hero image URL"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="cbx-kicker text-[var(--cbx-on-surface)]">Hero image alt text</p>
                                <Input
                                    value={aboutForm.data.content.hero.image_alt}
                                    onChange={(event) => updateObjectField(aboutForm, 'hero', 'image_alt', event.target.value)}
                                    placeholder="Hero image alt"
                                />
                            </div>

                            <Button type="submit">Save about hero image</Button>
                        </form>
                    </SectionCard>
                </section>

                <section className="space-y-6">
                    <div>
                        <p className="cbx-kicker">Storefront CMS</p>
                        <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Homepage and campaign merchandising</h2>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <SectionCard kicker="Homepage" title="Hero banners">
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                bannerForm.post(route('admin.banners.store'), {
                                    onSuccess: () => bannerForm.reset(),
                                    preserveScroll: true,
                                });
                            }} className="space-y-4">
                                <Input value={bannerForm.data.title} onChange={(event) => bannerForm.setData('title', event.target.value)} placeholder="Title" />
                                <Textarea value={bannerForm.data.subtitle} onChange={(event) => bannerForm.setData('subtitle', event.target.value)} placeholder="Subtitle" className="min-h-24" />
                                <Input value={bannerForm.data.image_url} onChange={(event) => bannerForm.setData('image_url', event.target.value)} placeholder="Image URL" />
                                <div className="grid gap-3 md:grid-cols-2">
                                    <Input value={bannerForm.data.cta_label} onChange={(event) => bannerForm.setData('cta_label', event.target.value)} placeholder="CTA label" />
                                    <Input value={bannerForm.data.cta_href} onChange={(event) => bannerForm.setData('cta_href', event.target.value)} placeholder="CTA href" />
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <Input type="number" min="0" value={bannerForm.data.sort_order} onChange={(event) => bannerForm.setData('sort_order', event.target.value)} placeholder="Sort order" />
                                    <label className="flex items-center rounded-xl border border-[var(--cbx-border-subtle)] px-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                        <input type="checkbox" checked={bannerForm.data.is_active} onChange={(event) => bannerForm.setData('is_active', event.target.checked)} className="mr-2" />
                                        Active on storefront
                                    </label>
                                </div>
                                <Button type="submit">Create banner</Button>
                            </form>
                            <div className="space-y-3">
                                {banners.length === 0 ? (
                                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">No banners yet.</p>
                                ) : banners.map((banner) => (
                                    <BannerEditor key={banner.id} banner={banner} />
                                ))}
                            </div>
                        </SectionCard>

                        <SectionCard kicker="Homepage" title="Hero CTA metadata">
                            <form onSubmit={(event) => { event.preventDefault(); heroForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-2">
                                    <Input value={heroForm.data.hero.primary_cta_label} onChange={(event) => heroForm.setData('hero', { ...heroForm.data.hero, primary_cta_label: event.target.value })} placeholder="Primary CTA label" />
                                    <Input value={heroForm.data.hero.primary_cta_href} onChange={(event) => heroForm.setData('hero', { ...heroForm.data.hero, primary_cta_href: event.target.value })} placeholder="Primary CTA href" />
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <Input value={heroForm.data.hero.secondary_cta_label} onChange={(event) => heroForm.setData('hero', { ...heroForm.data.hero, secondary_cta_label: event.target.value })} placeholder="Secondary CTA label" />
                                    <Input value={heroForm.data.hero.secondary_cta_href} onChange={(event) => heroForm.setData('hero', { ...heroForm.data.hero, secondary_cta_href: event.target.value })} placeholder="Secondary CTA href" />
                                </div>
                                <Button type="submit">Save hero copy</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="Promotions" title="Discount campaigns">
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                promoForm.post(route('admin.promotions.store'), {
                                    onSuccess: () => promoForm.reset(),
                                    preserveScroll: true,
                                });
                            }} className="space-y-4">
                                <Input value={promoForm.data.name} onChange={(event) => promoForm.setData('name', event.target.value)} placeholder="Name" />
                                <Input value={promoForm.data.code} onChange={(event) => promoForm.setData('code', event.target.value)} placeholder="Code" />
                                <Textarea value={promoForm.data.description} onChange={(event) => promoForm.setData('description', event.target.value)} placeholder="Description" className="min-h-24" />
                                <div className="grid gap-3 md:grid-cols-2">
                                    <select value={promoForm.data.discount_type} onChange={(event) => promoForm.setData('discount_type', event.target.value)} className={selectClassName}>
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                    <Input type="number" min="0" step="0.01" value={promoForm.data.discount_value} onChange={(event) => promoForm.setData('discount_value', event.target.value)} placeholder="Discount value" />
                                </div>
                                <label className="flex items-center rounded-xl border border-[var(--cbx-border-subtle)] px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">
                                    <input type="checkbox" checked={promoForm.data.is_active} onChange={(event) => promoForm.setData('is_active', event.target.checked)} className="mr-2" />
                                    Active on storefront
                                </label>
                                <Button type="submit">Create promotion</Button>
                            </form>
                            <div className="space-y-3">
                                {promotions.length === 0 ? (
                                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">No promotions yet.</p>
                                ) : promotions.map((promotion) => (
                                    <PromotionEditor key={promotion.id} promotion={promotion} />
                                ))}
                            </div>
                        </SectionCard>

                        <SectionCard kicker="Homepage" title="Support cards">
                            <form onSubmit={(event) => { event.preventDefault(); supportCardsForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                                {supportCardsForm.data.support_cards.map((card, index) => (
                                    <div key={index} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                        <Input value={card.title} onChange={(event) => updateSupportCard(index, 'title', event.target.value)} placeholder={`Card ${index + 1} title`} />
                                        <Textarea value={card.description} onChange={(event) => updateSupportCard(index, 'description', event.target.value)} placeholder={`Card ${index + 1} description`} className="min-h-24" />
                                    </div>
                                ))}
                                <Button type="submit">Save support cards</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="Homepage" title="Flash-sale messaging">
                            <form onSubmit={(event) => { event.preventDefault(); flashSaleForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                                <Input value={flashSaleForm.data.flash_sale.badge_label} onChange={(event) => flashSaleForm.setData('flash_sale', { ...flashSaleForm.data.flash_sale, badge_label: event.target.value })} placeholder="Badge label" />
                                <div className="grid gap-3 md:grid-cols-3">
                                    <Input value={flashSaleForm.data.flash_sale.hours_label} onChange={(event) => flashSaleForm.setData('flash_sale', { ...flashSaleForm.data.flash_sale, hours_label: event.target.value })} placeholder="Hours label" />
                                    <Input value={flashSaleForm.data.flash_sale.minutes_label} onChange={(event) => flashSaleForm.setData('flash_sale', { ...flashSaleForm.data.flash_sale, minutes_label: event.target.value })} placeholder="Minutes label" />
                                    <Input value={flashSaleForm.data.flash_sale.seconds_label} onChange={(event) => flashSaleForm.setData('flash_sale', { ...flashSaleForm.data.flash_sale, seconds_label: event.target.value })} placeholder="Seconds label" />
                                </div>
                                <Input value={flashSaleForm.data.flash_sale.highlight_label} onChange={(event) => flashSaleForm.setData('flash_sale', { ...flashSaleForm.data.flash_sale, highlight_label: event.target.value })} placeholder="Highlight label" />
                                <Button type="submit">Save flash-sale copy</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="Homepage" title="Category discovery copy">
                            <form onSubmit={(event) => { event.preventDefault(); categoryDiscoveryForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                                <Input value={categoryDiscoveryForm.data.category_discovery.kicker} onChange={(event) => categoryDiscoveryForm.setData('category_discovery', { ...categoryDiscoveryForm.data.category_discovery, kicker: event.target.value })} placeholder="Section kicker" />
                                <Input value={categoryDiscoveryForm.data.category_discovery.title} onChange={(event) => categoryDiscoveryForm.setData('category_discovery', { ...categoryDiscoveryForm.data.category_discovery, title: event.target.value })} placeholder="Section title" />
                                <Input value={categoryDiscoveryForm.data.category_discovery.link_label} onChange={(event) => categoryDiscoveryForm.setData('category_discovery', { ...categoryDiscoveryForm.data.category_discovery, link_label: event.target.value })} placeholder="Link label" />
                                <div className="grid gap-3 md:grid-cols-2">
                                    <Input value={categoryDiscoveryForm.data.category_discovery.tile_primary_prefix} onChange={(event) => categoryDiscoveryForm.setData('category_discovery', { ...categoryDiscoveryForm.data.category_discovery, tile_primary_prefix: event.target.value })} placeholder="Primary tile prefix" />
                                    <Input value={categoryDiscoveryForm.data.category_discovery.tile_cta_label} onChange={(event) => categoryDiscoveryForm.setData('category_discovery', { ...categoryDiscoveryForm.data.category_discovery, tile_cta_label: event.target.value })} placeholder="Tile CTA label" />
                                </div>
                                <Button type="submit">Save category copy</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="Homepage" title="New-arrivals copy">
                            <form onSubmit={(event) => { event.preventDefault(); newArrivalsForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                                <Input value={newArrivalsForm.data.new_arrivals.title} onChange={(event) => newArrivalsForm.setData('new_arrivals', { ...newArrivalsForm.data.new_arrivals, title: event.target.value })} placeholder="Section title" />
                                <Input value={newArrivalsForm.data.new_arrivals.link_label} onChange={(event) => newArrivalsForm.setData('new_arrivals', { ...newArrivalsForm.data.new_arrivals, link_label: event.target.value })} placeholder="Link label" />
                                <Button type="submit">Save new-arrivals copy</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="Homepage" title="Editorial and social content">
                            <form onSubmit={(event) => { event.preventDefault(); editorialForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                                <Input value={editorialForm.data.editorial.kicker} onChange={(event) => editorialForm.setData('editorial', { ...editorialForm.data.editorial, kicker: event.target.value })} placeholder="Section kicker" />
                                <Input value={editorialForm.data.editorial.title} onChange={(event) => editorialForm.setData('editorial', { ...editorialForm.data.editorial, title: event.target.value })} placeholder="Section title" />
                                <Textarea value={editorialForm.data.editorial.description} onChange={(event) => editorialForm.setData('editorial', { ...editorialForm.data.editorial, description: event.target.value })} placeholder="Section description" className="min-h-24" />
                                <div className="grid gap-3 md:grid-cols-2">
                                    <Input value={editorialForm.data.editorial.cta_label} onChange={(event) => editorialForm.setData('editorial', { ...editorialForm.data.editorial, cta_label: event.target.value })} placeholder="CTA label" />
                                    <Input value={editorialForm.data.editorial.cta_href} onChange={(event) => editorialForm.setData('editorial', { ...editorialForm.data.editorial, cta_href: event.target.value })} placeholder="CTA href" />
                                </div>
                                <Button type="submit">Save editorial copy</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="Homepage" title="Featured-products copy">
                            <form onSubmit={(event) => { event.preventDefault(); featuredProductsForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                                <Input value={featuredProductsForm.data.featured_products.kicker} onChange={(event) => featuredProductsForm.setData('featured_products', { ...featuredProductsForm.data.featured_products, kicker: event.target.value })} placeholder="Section kicker" />
                                <Input value={featuredProductsForm.data.featured_products.title} onChange={(event) => featuredProductsForm.setData('featured_products', { ...featuredProductsForm.data.featured_products, title: event.target.value })} placeholder="Section title" />
                                <Input value={featuredProductsForm.data.featured_products.link_label} onChange={(event) => featuredProductsForm.setData('featured_products', { ...featuredProductsForm.data.featured_products, link_label: event.target.value })} placeholder="Link label" />
                                <Button type="submit">Save featured-products copy</Button>
                            </form>
                        </SectionCard>
                    </div>
                </section>

                <section className="space-y-6">
                    <div>
                        <p className="cbx-kicker">Storefront CMS</p>
                        <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Shared shell and content pages</h2>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <SectionCard kicker="Shared shell" title="Utility strips and footer copy">
                            <form onSubmit={(event) => { event.preventDefault(); submitStorefrontSection(shellForm); }} className="space-y-5">
                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Top utility labels</p>
                                    {shellForm.data.content.utility_labels.map((label, index) => (
                                        <Input key={index} value={label} onChange={(event) => updateSimpleArrayItem(shellForm, 'utility_labels', index, event.target.value)} placeholder={`Label ${index + 1}`} />
                                    ))}
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Track-order block</p>
                                    <Input value={shellForm.data.content.order_tracking.kicker} onChange={(event) => updateObjectField(shellForm, 'order_tracking', 'kicker', event.target.value)} placeholder="Kicker" />
                                    <Input value={shellForm.data.content.order_tracking.title} onChange={(event) => updateObjectField(shellForm, 'order_tracking', 'title', event.target.value)} placeholder="Title" />
                                    <Textarea value={shellForm.data.content.order_tracking.description} onChange={(event) => updateObjectField(shellForm, 'order_tracking', 'description', event.target.value)} placeholder="Description" className="min-h-24" />
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={shellForm.data.content.order_tracking.input_placeholder} onChange={(event) => updateObjectField(shellForm, 'order_tracking', 'input_placeholder', event.target.value)} placeholder="Input placeholder" />
                                        <Input value={shellForm.data.content.order_tracking.button_label} onChange={(event) => updateObjectField(shellForm, 'order_tracking', 'button_label', event.target.value)} placeholder="Button label" />
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Account CTA</p>
                                    <Input value={shellForm.data.content.account_cta.kicker} onChange={(event) => updateObjectField(shellForm, 'account_cta', 'kicker', event.target.value)} placeholder="Kicker" />
                                    <Input value={shellForm.data.content.account_cta.title} onChange={(event) => updateObjectField(shellForm, 'account_cta', 'title', event.target.value)} placeholder="Title" />
                                    <Textarea value={shellForm.data.content.account_cta.description} onChange={(event) => updateObjectField(shellForm, 'account_cta', 'description', event.target.value)} placeholder="Description" className="min-h-24" />
                                    <div className="grid gap-3 md:grid-cols-3">
                                        <Input value={shellForm.data.content.account_cta.guest_primary_label} onChange={(event) => updateObjectField(shellForm, 'account_cta', 'guest_primary_label', event.target.value)} placeholder="Guest primary label" />
                                        <Input value={shellForm.data.content.account_cta.guest_secondary_label} onChange={(event) => updateObjectField(shellForm, 'account_cta', 'guest_secondary_label', event.target.value)} placeholder="Guest secondary label" />
                                        <Input value={shellForm.data.content.account_cta.member_primary_label} onChange={(event) => updateObjectField(shellForm, 'account_cta', 'member_primary_label', event.target.value)} placeholder="Member label" />
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Footer labels</p>
                                    <Textarea value={shellForm.data.content.footer.brand_description} onChange={(event) => updateObjectField(shellForm, 'footer', 'brand_description', event.target.value)} placeholder="Brand description" className="min-h-24" />
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={shellForm.data.content.footer.information_title} onChange={(event) => updateObjectField(shellForm, 'footer', 'information_title', event.target.value)} placeholder="Information title" />
                                        <Input value={shellForm.data.content.footer.company_title} onChange={(event) => updateObjectField(shellForm, 'footer', 'company_title', event.target.value)} placeholder="Company title" />
                                        <Input value={shellForm.data.content.footer.customer_care_title} onChange={(event) => updateObjectField(shellForm, 'footer', 'customer_care_title', event.target.value)} placeholder="Customer care title" />
                                        <Input value={shellForm.data.content.footer.multi_brand_title} onChange={(event) => updateObjectField(shellForm, 'footer', 'multi_brand_title', event.target.value)} placeholder="Multi-brand title" />
                                        <Input value={shellForm.data.content.footer.shop_all_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'shop_all_label', event.target.value)} placeholder="Shop all label" />
                                        <Input value={shellForm.data.content.footer.new_arrivals_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'new_arrivals_label', event.target.value)} placeholder="New arrivals label" />
                                        <Input value={shellForm.data.content.footer.create_account_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'create_account_label', event.target.value)} placeholder="Create account label" />
                                        <Input value={shellForm.data.content.footer.about_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'about_label', event.target.value)} placeholder="About label" />
                                        <Input value={shellForm.data.content.footer.location_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'location_label', event.target.value)} placeholder="Location label" />
                                        <Input value={shellForm.data.content.footer.contact_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'contact_label', event.target.value)} placeholder="Contact label" />
                                        <Input value={shellForm.data.content.footer.terms_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'terms_label', event.target.value)} placeholder="Terms label" />
                                        <Input value={shellForm.data.content.footer.shopping_bag_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'shopping_bag_label', event.target.value)} placeholder="Shopping bag label" />
                                        <Input value={shellForm.data.content.footer.customer_access_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'customer_access_label', event.target.value)} placeholder="Customer access label" />
                                        <Input value={shellForm.data.content.footer.back_to_top_label} onChange={(event) => updateObjectField(shellForm, 'footer', 'back_to_top_label', event.target.value)} placeholder="Back to top label" />
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-3">
                                        {shellForm.data.content.footer.multi_brand_labels.map((label, index) => (
                                            <Input key={index} value={label} onChange={(event) => updateNestedSimpleArrayItem(shellForm, 'footer', 'multi_brand_labels', index, event.target.value)} placeholder={`Footer brand ${index + 1}`} />
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit">Save shell content</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="About page" title="Brand story content">
                            <form onSubmit={(event) => { event.preventDefault(); submitStorefrontSection(aboutForm); }} className="space-y-5">
                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Hero</p>
                                    <Input value={aboutForm.data.content.hero.kicker} onChange={(event) => updateObjectField(aboutForm, 'hero', 'kicker', event.target.value)} placeholder="Hero kicker" />
                                    <Textarea value={aboutForm.data.content.hero.title} onChange={(event) => updateObjectField(aboutForm, 'hero', 'title', event.target.value)} placeholder="Hero title lines" className="min-h-24" />
                                    <Input value={aboutForm.data.content.hero.highlight} onChange={(event) => updateObjectField(aboutForm, 'hero', 'highlight', event.target.value)} placeholder="Highlight text" />
                                    <Textarea value={aboutForm.data.content.hero.description} onChange={(event) => updateObjectField(aboutForm, 'hero', 'description', event.target.value)} placeholder="Hero description" className="min-h-24" />
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={aboutForm.data.content.hero.image_url} onChange={(event) => updateObjectField(aboutForm, 'hero', 'image_url', event.target.value)} placeholder="Hero image URL" />
                                        <Input value={aboutForm.data.content.hero.image_alt} onChange={(event) => updateObjectField(aboutForm, 'hero', 'image_alt', event.target.value)} placeholder="Hero image alt" />
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Mission</p>
                                    <Input value={aboutForm.data.content.mission.title} onChange={(event) => updateObjectField(aboutForm, 'mission', 'title', event.target.value)} placeholder="Section title" />
                                    <Textarea value={aboutForm.data.content.mission.description} onChange={(event) => updateObjectField(aboutForm, 'mission', 'description', event.target.value)} placeholder="Mission description" className="min-h-24" />
                                    <Textarea value={aboutForm.data.content.mission.quote} onChange={(event) => updateObjectField(aboutForm, 'mission', 'quote', event.target.value)} placeholder="Quote" className="min-h-24" />
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={aboutForm.data.content.mission.image_url} onChange={(event) => updateObjectField(aboutForm, 'mission', 'image_url', event.target.value)} placeholder="Mission image URL" />
                                        <Input value={aboutForm.data.content.mission.image_alt} onChange={(event) => updateObjectField(aboutForm, 'mission', 'image_alt', event.target.value)} placeholder="Mission image alt" />
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Timeline</p>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={aboutForm.data.content.timeline.title} onChange={(event) => updateObjectField(aboutForm, 'timeline', 'title', event.target.value)} placeholder="Timeline title" />
                                        <Input value={aboutForm.data.content.timeline.kicker} onChange={(event) => updateObjectField(aboutForm, 'timeline', 'kicker', event.target.value)} placeholder="Timeline kicker" />
                                    </div>
                                    {aboutForm.data.content.timeline.items.map((item, index) => (
                                        <div key={index} className="space-y-3 rounded-lg border border-[var(--cbx-border-subtle)] p-4">
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <Input value={item.year} onChange={(event) => updateNestedArrayItem(aboutForm, 'timeline', 'items', index, { year: event.target.value })} placeholder="Year" />
                                                <Input value={item.title} onChange={(event) => updateNestedArrayItem(aboutForm, 'timeline', 'items', index, { title: event.target.value })} placeholder="Entry title" />
                                            </div>
                                            <Textarea value={item.description} onChange={(event) => updateNestedArrayItem(aboutForm, 'timeline', 'items', index, { description: event.target.value })} placeholder="Entry description" className="min-h-24" />
                                            <label className="flex items-center gap-3 text-sm text-[var(--cbx-on-surface)]">
                                                <input type="checkbox" checked={item.featured} onChange={(event) => updateNestedArrayItem(aboutForm, 'timeline', 'items', index, { featured: event.target.checked })} />
                                                Featured card
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Values</p>
                                    <Input value={aboutForm.data.content.values.title} onChange={(event) => updateObjectField(aboutForm, 'values', 'title', event.target.value)} placeholder="Values title" />
                                    {aboutForm.data.content.values.items.map((item, index) => (
                                        <div key={index} className="space-y-3 rounded-lg border border-[var(--cbx-border-subtle)] p-4">
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <Input value={item.icon} onChange={(event) => updateNestedArrayItem(aboutForm, 'values', 'items', index, { icon: event.target.value })} placeholder="Icon name" />
                                                <Input value={item.color} onChange={(event) => updateNestedArrayItem(aboutForm, 'values', 'items', index, { color: event.target.value })} placeholder="Tailwind color class" />
                                            </div>
                                            <Input value={item.label} onChange={(event) => updateNestedArrayItem(aboutForm, 'values', 'items', index, { label: event.target.value })} placeholder="Value label" />
                                            <Textarea value={item.description} onChange={(event) => updateNestedArrayItem(aboutForm, 'values', 'items', index, { description: event.target.value })} placeholder="Value description" className="min-h-24" />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Closing CTA</p>
                                    <Input value={aboutForm.data.content.cta.title} onChange={(event) => updateObjectField(aboutForm, 'cta', 'title', event.target.value)} placeholder="CTA title" />
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={aboutForm.data.content.cta.button_label} onChange={(event) => updateObjectField(aboutForm, 'cta', 'button_label', event.target.value)} placeholder="Button label" />
                                        <Input value={aboutForm.data.content.cta.button_href} onChange={(event) => updateObjectField(aboutForm, 'cta', 'button_href', event.target.value)} placeholder="Button href" />
                                        <Input value={aboutForm.data.content.cta.image_url} onChange={(event) => updateObjectField(aboutForm, 'cta', 'image_url', event.target.value)} placeholder="Image URL" />
                                        <Input value={aboutForm.data.content.cta.image_alt} onChange={(event) => updateObjectField(aboutForm, 'cta', 'image_alt', event.target.value)} placeholder="Image alt" />
                                    </div>
                                </div>

                                <Button type="submit">Save about content</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="Contact page" title="Support and outreach content">
                            <form onSubmit={(event) => { event.preventDefault(); submitStorefrontSection(contactForm); }} className="space-y-5">
                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Intro</p>
                                    <Input value={contactForm.data.content.intro.kicker} onChange={(event) => updateObjectField(contactForm, 'intro', 'kicker', event.target.value)} placeholder="Intro kicker" />
                                    <Input value={contactForm.data.content.intro.title} onChange={(event) => updateObjectField(contactForm, 'intro', 'title', event.target.value)} placeholder="Intro title" />
                                    <Textarea value={contactForm.data.content.intro.description} onChange={(event) => updateObjectField(contactForm, 'intro', 'description', event.target.value)} placeholder="Intro description" className="min-h-24" />
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Message form</p>
                                    <Input value={contactForm.data.content.form.kicker} onChange={(event) => updateObjectField(contactForm, 'form', 'kicker', event.target.value)} placeholder="Form kicker" />
                                    <Input value={contactForm.data.content.form.title} onChange={(event) => updateObjectField(contactForm, 'form', 'title', event.target.value)} placeholder="Form title" />
                                    <Textarea value={contactForm.data.content.form.description} onChange={(event) => updateObjectField(contactForm, 'form', 'description', event.target.value)} placeholder="Form description" className="min-h-24" />
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={contactForm.data.content.form.name_label} onChange={(event) => updateObjectField(contactForm, 'form', 'name_label', event.target.value)} placeholder="Name label" />
                                        <Input value={contactForm.data.content.form.email_label} onChange={(event) => updateObjectField(contactForm, 'form', 'email_label', event.target.value)} placeholder="Email label" />
                                        <Input value={contactForm.data.content.form.topic_label} onChange={(event) => updateObjectField(contactForm, 'form', 'topic_label', event.target.value)} placeholder="Topic label" />
                                        <Input value={contactForm.data.content.form.topic_placeholder} onChange={(event) => updateObjectField(contactForm, 'form', 'topic_placeholder', event.target.value)} placeholder="Topic placeholder" />
                                        <Input value={contactForm.data.content.form.order_number_label} onChange={(event) => updateObjectField(contactForm, 'form', 'order_number_label', event.target.value)} placeholder="Order label" />
                                        <Input value={contactForm.data.content.form.message_label} onChange={(event) => updateObjectField(contactForm, 'form', 'message_label', event.target.value)} placeholder="Message label" />
                                        <Input value={contactForm.data.content.form.message_placeholder} onChange={(event) => updateObjectField(contactForm, 'form', 'message_placeholder', event.target.value)} placeholder="Message placeholder" />
                                        <Input value={contactForm.data.content.form.submit_button_label} onChange={(event) => updateObjectField(contactForm, 'form', 'submit_button_label', event.target.value)} placeholder="Button label" />
                                        <Input value={contactForm.data.content.form.email_recipient} onChange={(event) => updateObjectField(contactForm, 'form', 'email_recipient', event.target.value)} placeholder="Support email" />
                                    </div>
                                    <Textarea value={contactForm.data.content.form.submit_note} onChange={(event) => updateObjectField(contactForm, 'form', 'submit_note', event.target.value)} placeholder="Submit note" className="min-h-24" />
                                    {contactForm.data.content.form.topics.map((item, index) => (
                                        <div key={index} className="grid gap-3 rounded-lg border border-[var(--cbx-border-subtle)] p-4 md:grid-cols-2">
                                            <Input value={item.value} onChange={(event) => updateNestedArrayItem(contactForm, 'form', 'topics', index, { value: event.target.value })} placeholder="Topic value" />
                                            <Input value={item.label} onChange={(event) => updateNestedArrayItem(contactForm, 'form', 'topics', index, { label: event.target.value })} placeholder="Topic label" />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Support channels</p>
                                    <Input value={contactForm.data.content.support.kicker} onChange={(event) => updateObjectField(contactForm, 'support', 'kicker', event.target.value)} placeholder="Support kicker" />
                                    <Input value={contactForm.data.content.support.title} onChange={(event) => updateObjectField(contactForm, 'support', 'title', event.target.value)} placeholder="Support title" />
                                    {contactForm.data.content.support.channels.map((item, index) => (
                                        <div key={index} className="space-y-3 rounded-lg border border-[var(--cbx-border-subtle)] p-4">
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <Input value={item.icon} onChange={(event) => updateNestedArrayItem(contactForm, 'support', 'channels', index, { icon: event.target.value })} placeholder="Icon name" />
                                                <Input value={item.title} onChange={(event) => updateNestedArrayItem(contactForm, 'support', 'channels', index, { title: event.target.value })} placeholder="Channel title" />
                                                <Input value={item.value} onChange={(event) => updateNestedArrayItem(contactForm, 'support', 'channels', index, { value: event.target.value })} placeholder="Channel value" />
                                                <Input value={item.href} onChange={(event) => updateNestedArrayItem(contactForm, 'support', 'channels', index, { href: event.target.value })} placeholder="Channel href" />
                                            </div>
                                            <Textarea value={item.detail} onChange={(event) => updateNestedArrayItem(contactForm, 'support', 'channels', index, { detail: event.target.value })} placeholder="Support detail" className="min-h-24" />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Sidebar CTAs</p>
                                    <Input value={contactForm.data.content.faq.kicker} onChange={(event) => updateObjectField(contactForm, 'faq', 'kicker', event.target.value)} placeholder="FAQ kicker" />
                                    <Input value={contactForm.data.content.faq.title} onChange={(event) => updateObjectField(contactForm, 'faq', 'title', event.target.value)} placeholder="FAQ title" />
                                    <Textarea value={contactForm.data.content.faq.description} onChange={(event) => updateObjectField(contactForm, 'faq', 'description', event.target.value)} placeholder="FAQ description" className="min-h-24" />
                                    <Input value={contactForm.data.content.faq.button_label} onChange={(event) => updateObjectField(contactForm, 'faq', 'button_label', event.target.value)} placeholder="FAQ button label" />
                                    <Input value={contactForm.data.content.visit.kicker} onChange={(event) => updateObjectField(contactForm, 'visit', 'kicker', event.target.value)} placeholder="Visit kicker" />
                                    <Input value={contactForm.data.content.visit.title} onChange={(event) => updateObjectField(contactForm, 'visit', 'title', event.target.value)} placeholder="Visit title" />
                                    <Textarea value={contactForm.data.content.visit.description} onChange={(event) => updateObjectField(contactForm, 'visit', 'description', event.target.value)} placeholder="Visit description" className="min-h-24" />
                                    <Input value={contactForm.data.content.visit.button_label} onChange={(event) => updateObjectField(contactForm, 'visit', 'button_label', event.target.value)} placeholder="Visit button label" />
                                </div>

                                <Button type="submit">Save contact content</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="Legal" title="Terms of service content">
                            <form onSubmit={(event) => { event.preventDefault(); submitStorefrontSection(termsForm); }} className="space-y-5">
                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Page intro</p>
                                    <Input value={termsForm.data.content.page_intro.kicker} onChange={(event) => updateObjectField(termsForm, 'page_intro', 'kicker', event.target.value)} placeholder="Intro kicker" />
                                    <Input value={termsForm.data.content.page_intro.title} onChange={(event) => updateObjectField(termsForm, 'page_intro', 'title', event.target.value)} placeholder="Intro title" />
                                    <Textarea value={termsForm.data.content.page_intro.description} onChange={(event) => updateObjectField(termsForm, 'page_intro', 'description', event.target.value)} placeholder="Intro description" className="min-h-24" />
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={termsForm.data.content.last_updated} onChange={(event) => termsForm.setData('content', { ...termsForm.data.content, last_updated: event.target.value })} placeholder="Last updated" />
                                        <Input value={termsForm.data.content.last_updated_label} onChange={(event) => termsForm.setData('content', { ...termsForm.data.content, last_updated_label: event.target.value })} placeholder="Last updated label" />
                                        <Input value={termsForm.data.content.tab_labels.terms} onChange={(event) => termsForm.setData('content', { ...termsForm.data.content, tab_labels: { ...termsForm.data.content.tab_labels, terms: event.target.value } })} placeholder="Terms tab label" />
                                        <Input value={termsForm.data.content.tab_labels.privacy} onChange={(event) => termsForm.setData('content', { ...termsForm.data.content, tab_labels: { ...termsForm.data.content.tab_labels, privacy: event.target.value } })} placeholder="Privacy tab label" />
                                    </div>
                                    <Textarea value={termsForm.data.content.page_summary} onChange={(event) => termsForm.setData('content', { ...termsForm.data.content, page_summary: event.target.value })} placeholder="Summary card copy" className="min-h-24" />
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Terms content</p>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={termsForm.data.content.section_kicker} onChange={(event) => termsForm.setData('content', { ...termsForm.data.content, section_kicker: event.target.value })} placeholder="Section kicker" />
                                        <Input value={termsForm.data.content.section_title} onChange={(event) => termsForm.setData('content', { ...termsForm.data.content, section_title: event.target.value })} placeholder="Section title" />
                                    </div>
                                    {termsForm.data.content.sections.map((item, index) => (
                                        <div key={index} className="space-y-3 rounded-lg border border-[var(--cbx-border-subtle)] p-4">
                                            <Input value={item.title} onChange={(event) => updateArrayItem(termsForm, 'sections', index, { title: event.target.value })} placeholder="Section title" />
                                            <Textarea value={item.content} onChange={(event) => updateArrayItem(termsForm, 'sections', index, { content: event.target.value })} placeholder="Section content" className="min-h-24" />
                                            <Textarea
                                                value={item.points.join('\n')}
                                                onChange={(event) => updateArrayItem(termsForm, 'sections', index, {
                                                    points: event.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                                                })}
                                                placeholder="Bullet points, one per line"
                                                className="min-h-24"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <Button type="submit">Save terms content</Button>
                            </form>
                        </SectionCard>

                        <SectionCard kicker="Legal" title="Privacy policy content">
                            <form onSubmit={(event) => { event.preventDefault(); submitStorefrontSection(privacyForm); }} className="space-y-5">
                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Privacy sections</p>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input value={privacyForm.data.content.section_kicker} onChange={(event) => privacyForm.setData('content', { ...privacyForm.data.content, section_kicker: event.target.value })} placeholder="Section kicker" />
                                        <Input value={privacyForm.data.content.section_title} onChange={(event) => privacyForm.setData('content', { ...privacyForm.data.content, section_title: event.target.value })} placeholder="Section title" />
                                    </div>
                                    {privacyForm.data.content.sections.map((item, index) => (
                                        <div key={index} className="space-y-3 rounded-lg border border-[var(--cbx-border-subtle)] p-4">
                                            <Input value={item.title} onChange={(event) => updateArrayItem(privacyForm, 'sections', index, { title: event.target.value })} placeholder="Section title" />
                                            <Textarea value={item.content} onChange={(event) => updateArrayItem(privacyForm, 'sections', index, { content: event.target.value })} placeholder="Section content" className="min-h-24" />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Security standards</p>
                                    <Input value={privacyForm.data.content.security_title} onChange={(event) => privacyForm.setData('content', { ...privacyForm.data.content, security_title: event.target.value })} placeholder="Security title" />
                                    {privacyForm.data.content.security_standards.map((item, index) => (
                                        <div key={index} className="space-y-3 rounded-lg border border-[var(--cbx-border-subtle)] p-4">
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <Input value={item.icon} onChange={(event) => updateArrayItem(privacyForm, 'security_standards', index, { icon: event.target.value })} placeholder="Icon name" />
                                                <Input value={item.title} onChange={(event) => updateArrayItem(privacyForm, 'security_standards', index, { title: event.target.value })} placeholder="Standard title" />
                                            </div>
                                            <Textarea value={item.content} onChange={(event) => updateArrayItem(privacyForm, 'security_standards', index, { content: event.target.value })} placeholder="Standard content" className="min-h-24" />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">Usage highlights</p>
                                    <Input value={privacyForm.data.content.usage_title} onChange={(event) => privacyForm.setData('content', { ...privacyForm.data.content, usage_title: event.target.value })} placeholder="Usage title" />
                                    <Textarea value={privacyForm.data.content.usage_description} onChange={(event) => privacyForm.setData('content', { ...privacyForm.data.content, usage_description: event.target.value })} placeholder="Usage description" className="min-h-24" />
                                    {privacyForm.data.content.usage_highlights.map((item, index) => (
                                        <div key={index} className="space-y-3 rounded-lg border border-[var(--cbx-border-subtle)] p-4">
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <Input value={item.title} onChange={(event) => updateArrayItem(privacyForm, 'usage_highlights', index, { title: event.target.value })} placeholder="Highlight title" />
                                                <Input value={item.accent_class} onChange={(event) => updateArrayItem(privacyForm, 'usage_highlights', index, { accent_class: event.target.value })} placeholder="Accent class" />
                                            </div>
                                            <Textarea value={item.content} onChange={(event) => updateArrayItem(privacyForm, 'usage_highlights', index, { content: event.target.value })} placeholder="Highlight content" className="min-h-24" />
                                        </div>
                                    ))}
                                </div>

                                <Button type="submit">Save privacy content</Button>
                            </form>
                        </SectionCard>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
