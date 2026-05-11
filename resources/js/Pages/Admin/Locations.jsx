import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

function LocationEditor({ location }) {
    const form = useForm({
        name: location.name,
        address: location.address,
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude,
        distance: location.distance,
        hours: location.hours,
        phone: location.phone,
        services: location.services?.join(', ') || '',
        is_active: location.is_active,
        sort_order: location.sort_order,
    });

    return (
        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.locations.update', location.id)); }} className="space-y-4 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-semibold text-[var(--cbx-on-surface)]">{location.name}</p>
                    <p className="text-sm text-[var(--cbx-on-surface-variant)]">{location.city}</p>
                </div>
                <label className="text-sm text-[var(--cbx-on-surface-variant)]">
                    <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="mr-2" />
                    Active on storefront
                </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Store name" />
                <Input value={form.data.city} onChange={(event) => form.setData('city', event.target.value)} placeholder="City" />
            </div>
            <Input value={form.data.address} onChange={(event) => form.setData('address', event.target.value)} placeholder="Address" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Input value={form.data.latitude} onChange={(event) => form.setData('latitude', event.target.value)} placeholder="Latitude" />
                <Input value={form.data.longitude} onChange={(event) => form.setData('longitude', event.target.value)} placeholder="Longitude" />
                <Input value={form.data.distance} onChange={(event) => form.setData('distance', event.target.value)} placeholder="Distance (km)" />
                <Input value={form.data.sort_order} onChange={(event) => form.setData('sort_order', event.target.value)} placeholder="Sort order" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                <Input value={form.data.hours} onChange={(event) => form.setData('hours', event.target.value)} placeholder="Hours" />
                <Input value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} placeholder="Phone" />
            </div>
            <Textarea value={form.data.services} onChange={(event) => form.setData('services', event.target.value)} placeholder="Services, separated by commas" className="min-h-20" />
            <Button type="submit" variant="secondary">Update location</Button>
        </form>
    );
}

export default function Locations({ locations }) {
    const createForm = useForm({
        name: '',
        address: '',
        city: '',
        latitude: '',
        longitude: '',
        distance: 0,
        hours: '',
        phone: '',
        services: '',
        is_active: true,
        sort_order: 0,
    });

    return (
        <AdminLayout title="Store locations" section="locations">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Locations</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Add store location</h2>
                        </div>
                        <form onSubmit={(event) => { event.preventDefault(); createForm.post(route('admin.locations.store')); }} className="space-y-4">
                            <div className="grid gap-3 md:grid-cols-2">
                                <Input value={createForm.data.name} onChange={(event) => createForm.setData('name', event.target.value)} placeholder="Store name" />
                                <Input value={createForm.data.city} onChange={(event) => createForm.setData('city', event.target.value)} placeholder="City" />
                            </div>
                            <Input value={createForm.data.address} onChange={(event) => createForm.setData('address', event.target.value)} placeholder="Address" />
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                <Input value={createForm.data.latitude} onChange={(event) => createForm.setData('latitude', event.target.value)} placeholder="Latitude" />
                                <Input value={createForm.data.longitude} onChange={(event) => createForm.setData('longitude', event.target.value)} placeholder="Longitude" />
                                <Input value={createForm.data.distance} onChange={(event) => createForm.setData('distance', event.target.value)} placeholder="Distance (km)" />
                                <Input value={createForm.data.sort_order} onChange={(event) => createForm.setData('sort_order', event.target.value)} placeholder="Sort order" />
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <Input value={createForm.data.hours} onChange={(event) => createForm.setData('hours', event.target.value)} placeholder="Hours" />
                                <Input value={createForm.data.phone} onChange={(event) => createForm.setData('phone', event.target.value)} placeholder="Phone" />
                            </div>
                            <Textarea value={createForm.data.services} onChange={(event) => createForm.setData('services', event.target.value)} placeholder="Services, separated by commas" className="min-h-20" />
                            <label className="text-sm text-[var(--cbx-on-surface-variant)]">
                                <input type="checkbox" checked={createForm.data.is_active} onChange={(event) => createForm.setData('is_active', event.target.checked)} className="mr-2" />
                                Active on storefront
                            </label>
                            <Button type="submit">Save location</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Workspace</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Manage locations</h2>
                        </div>
                        <div className="space-y-4">
                            {locations.length === 0 ? (
                                <p className="text-sm text-[var(--cbx-on-surface-variant)]">Store locations will appear here after the first save.</p>
                            ) : locations.map((location) => <LocationEditor key={location.id} location={location} />)}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
