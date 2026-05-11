import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function Merchandising({ banners, homepageContent, promotions }) {
    const bannerForm = useForm({ title: '', subtitle: '', image_url: '', cta_label: '', cta_href: '', sort_order: 0 });
    const promoForm = useForm({ name: '', code: '', description: '', discount_type: 'percentage', discount_value: 0 });
    const heroForm = useForm({ section: 'hero', hero: homepageContent.hero });
    const supportCardsForm = useForm({ section: 'support_cards', support_cards: homepageContent.support_cards });
    const flashSaleForm = useForm({ section: 'flash_sale', flash_sale: homepageContent.flash_sale });
    const categoryDiscoveryForm = useForm({ section: 'category_discovery', category_discovery: homepageContent.category_discovery });
    const newArrivalsForm = useForm({ section: 'new_arrivals', new_arrivals: homepageContent.new_arrivals });
    const editorialForm = useForm({ section: 'editorial', editorial: homepageContent.editorial });
    const featuredProductsForm = useForm({ section: 'featured_products', featured_products: homepageContent.featured_products });

    const updateSupportCard = (index, field, value) => {
        supportCardsForm.setData('support_cards', supportCardsForm.data.support_cards.map((card, cardIndex) => (
            cardIndex === index ? { ...card, [field]: value } : card
        )));
    };

    return (
        <AdminLayout title="Merchandising" section="merchandising">
            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Homepage</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Hero banners</h2>
                        </div>
                        <form onSubmit={(event) => { event.preventDefault(); bannerForm.post(route('admin.banners.store')); }} className="space-y-4">
                            <Input value={bannerForm.data.title} onChange={(event) => bannerForm.setData('title', event.target.value)} placeholder="Title" />
                            <Input value={bannerForm.data.subtitle} onChange={(event) => bannerForm.setData('subtitle', event.target.value)} placeholder="Subtitle" />
                            <Input value={bannerForm.data.image_url} onChange={(event) => bannerForm.setData('image_url', event.target.value)} placeholder="Image URL" />
                            <div className="grid gap-3 md:grid-cols-2">
                                <Input value={bannerForm.data.cta_label} onChange={(event) => bannerForm.setData('cta_label', event.target.value)} placeholder="CTA label" />
                                <Input value={bannerForm.data.cta_href} onChange={(event) => bannerForm.setData('cta_href', event.target.value)} placeholder="CTA href" />
                            </div>
                            <Input value={bannerForm.data.sort_order} onChange={(event) => bannerForm.setData('sort_order', event.target.value)} placeholder="Sort order" />
                            <Button type="submit">Save banner</Button>
                        </form>
                        <div className="space-y-3">
                            {banners.length === 0 ? (
                                <p className="text-sm text-[var(--cbx-on-surface-variant)]">No banners yet.</p>
                            ) : banners.map((banner) => (
                                <div key={banner.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{banner.title}</p>
                                    <p className="mt-1">Sort order: {banner.sort_order}</p>
                                    <p>{banner.image_url}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Homepage</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Hero CTA metadata</h2>
                        </div>
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
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Promotions</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Discount campaigns</h2>
                        </div>
                        <form onSubmit={(event) => { event.preventDefault(); promoForm.post(route('admin.promotions.store')); }} className="space-y-4">
                            <Input value={promoForm.data.name} onChange={(event) => promoForm.setData('name', event.target.value)} placeholder="Name" />
                            <Input value={promoForm.data.code} onChange={(event) => promoForm.setData('code', event.target.value)} placeholder="Code" />
                            <Textarea value={promoForm.data.description} onChange={(event) => promoForm.setData('description', event.target.value)} placeholder="Description" className="min-h-24" />
                            <div className="grid gap-3 md:grid-cols-2">
                                <Input value={promoForm.data.discount_type} onChange={(event) => promoForm.setData('discount_type', event.target.value)} placeholder="Discount type" />
                                <Input value={promoForm.data.discount_value} onChange={(event) => promoForm.setData('discount_value', event.target.value)} placeholder="Discount value" />
                            </div>
                            <Button type="submit">Save promotion</Button>
                        </form>
                        <div className="space-y-3">
                            {promotions.length === 0 ? (
                                <p className="text-sm text-[var(--cbx-on-surface-variant)]">No promotions yet.</p>
                            ) : promotions.map((promotion) => (
                                <div key={promotion.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{promotion.name}</p>
                                    <p className="mt-1">{promotion.discount_type} · {promotion.discount_value}</p>
                                    <p>{promotion.code || 'No code'}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Homepage</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Support cards</h2>
                        </div>
                        <form onSubmit={(event) => { event.preventDefault(); supportCardsForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                            {supportCardsForm.data.support_cards.map((card, index) => (
                                <div key={index} className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <Input value={card.title} onChange={(event) => updateSupportCard(index, 'title', event.target.value)} placeholder={`Card ${index + 1} title`} />
                                    <Textarea value={card.description} onChange={(event) => updateSupportCard(index, 'description', event.target.value)} placeholder={`Card ${index + 1} description`} className="min-h-24" />
                                </div>
                            ))}
                            <Button type="submit">Save support cards</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Homepage</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Flash-sale messaging</h2>
                        </div>
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
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Homepage</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Category discovery copy</h2>
                        </div>
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
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Homepage</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">New-arrivals copy</h2>
                        </div>
                        <form onSubmit={(event) => { event.preventDefault(); newArrivalsForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                            <Input value={newArrivalsForm.data.new_arrivals.title} onChange={(event) => newArrivalsForm.setData('new_arrivals', { ...newArrivalsForm.data.new_arrivals, title: event.target.value })} placeholder="Section title" />
                            <Input value={newArrivalsForm.data.new_arrivals.link_label} onChange={(event) => newArrivalsForm.setData('new_arrivals', { ...newArrivalsForm.data.new_arrivals, link_label: event.target.value })} placeholder="Link label" />
                            <Button type="submit">Save new-arrivals copy</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Homepage</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Editorial and social content</h2>
                        </div>
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
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Homepage</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Featured-products copy</h2>
                        </div>
                        <form onSubmit={(event) => { event.preventDefault(); featuredProductsForm.patch(route('admin.homepage-content.update')); }} className="space-y-4">
                            <Input value={featuredProductsForm.data.featured_products.kicker} onChange={(event) => featuredProductsForm.setData('featured_products', { ...featuredProductsForm.data.featured_products, kicker: event.target.value })} placeholder="Section kicker" />
                            <Input value={featuredProductsForm.data.featured_products.title} onChange={(event) => featuredProductsForm.setData('featured_products', { ...featuredProductsForm.data.featured_products, title: event.target.value })} placeholder="Section title" />
                            <Input value={featuredProductsForm.data.featured_products.link_label} onChange={(event) => featuredProductsForm.setData('featured_products', { ...featuredProductsForm.data.featured_products, link_label: event.target.value })} placeholder="Link label" />
                            <Button type="submit">Save featured-products copy</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
