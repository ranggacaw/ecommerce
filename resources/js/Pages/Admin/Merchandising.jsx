import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function Merchandising({ banners, promotions }) {
    const bannerForm = useForm({ title: '', subtitle: '', image_url: '', cta_label: '', cta_href: '', sort_order: 0 });
    const promoForm = useForm({ name: '', code: '', description: '', discount_type: 'percentage', discount_value: 0 });

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
            </div>
        </AdminLayout>
    );
}
