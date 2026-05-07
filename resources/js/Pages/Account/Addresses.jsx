import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import AccountLayout from '@/Layouts/AccountLayout';
import { router, useForm } from '@inertiajs/react';

function AddressEditor({ address }) {
    const form = useForm({ ...address });

    return (
        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('account.addresses.update', address.id)); }} className="grid gap-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
            <div className="grid gap-3 md:grid-cols-2">
                <Input value={form.data.label || ''} onChange={(event) => form.setData('label', event.target.value)} placeholder="Label" />
                <Input value={form.data.recipient_name || ''} onChange={(event) => form.setData('recipient_name', event.target.value)} placeholder="Recipient" />
                <Input value={form.data.phone || ''} onChange={(event) => form.setData('phone', event.target.value)} placeholder="Phone" />
                <Input value={form.data.country || ''} onChange={(event) => form.setData('country', event.target.value)} placeholder="Country" />
            </div>
            <Input value={form.data.line1 || ''} onChange={(event) => form.setData('line1', event.target.value)} placeholder="Address line 1" />
            <Input value={form.data.line2 || ''} onChange={(event) => form.setData('line2', event.target.value)} placeholder="Address line 2" />
            <div className="grid gap-3 md:grid-cols-3">
                <Input value={form.data.city || ''} onChange={(event) => form.setData('city', event.target.value)} placeholder="City" />
                <Input value={form.data.province || ''} onChange={(event) => form.setData('province', event.target.value)} placeholder="Province" />
                <Input value={form.data.postal_code || ''} onChange={(event) => form.setData('postal_code', event.target.value)} placeholder="Postal code" />
            </div>
            <label className="text-sm text-[var(--cbx-on-surface-variant)]"><input type="checkbox" checked={Boolean(form.data.is_default)} onChange={(event) => form.setData('is_default', event.target.checked)} className="mr-2" />Set as default</label>
            <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="secondary">Update address</Button>
                <Button type="button" variant="danger" onClick={() => router.delete(route('account.addresses.destroy', address.id))}>Delete</Button>
            </div>
        </form>
    );
}

export default function Addresses({ addresses }) {
    const form = useForm({
        label: '',
        recipient_name: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        province: '',
        postal_code: '',
        country: 'Indonesia',
        is_default: false,
    });

    return (
        <AccountLayout title="Addresses">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Saved addresses</p>
                            <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">Edit delivery details</h1>
                        </div>
                        <div className="space-y-4">
                            {addresses.map((address) => <AddressEditor key={address.id} address={address} />)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <form onSubmit={(event) => { event.preventDefault(); form.post(route('account.addresses.store')); }} className="space-y-4">
                            <div>
                                <p className="cbx-kicker">New address</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Add another destination</h2>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <Input value={form.data.label} onChange={(event) => form.setData('label', event.target.value)} placeholder="Label" />
                                <Input value={form.data.recipient_name} onChange={(event) => form.setData('recipient_name', event.target.value)} placeholder="Recipient" />
                                <Input value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} placeholder="Phone" />
                                <Input value={form.data.country} onChange={(event) => form.setData('country', event.target.value)} placeholder="Country" />
                            </div>
                            <Input value={form.data.line1} onChange={(event) => form.setData('line1', event.target.value)} placeholder="Address line 1" />
                            <Input value={form.data.line2} onChange={(event) => form.setData('line2', event.target.value)} placeholder="Address line 2" />
                            <div className="grid gap-3 md:grid-cols-3">
                                <Input value={form.data.city} onChange={(event) => form.setData('city', event.target.value)} placeholder="City" />
                                <Input value={form.data.province} onChange={(event) => form.setData('province', event.target.value)} placeholder="Province" />
                                <Input value={form.data.postal_code} onChange={(event) => form.setData('postal_code', event.target.value)} placeholder="Postal code" />
                            </div>
                            <label className="text-sm text-[var(--cbx-on-surface-variant)]"><input type="checkbox" checked={form.data.is_default} onChange={(event) => form.setData('is_default', event.target.checked)} className="mr-2" />Set as default</label>
                            <Button type="submit" className="w-full">Save address</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AccountLayout>
    );
}
