import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

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

    const destroyLocation = () => {
        if (!window.confirm(`Delete location "${location.name}"?`)) {
            return;
        }

        form.delete(route('admin.locations.destroy', location.id), { preserveScroll: true });
    };

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
            <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="secondary">Update location</Button>
                <Button type="button" variant="danger" onClick={destroyLocation}>Delete location</Button>
            </div>
        </form>
    );
}

export default function Locations({ locations, filters }) {
    const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id ?? null);
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

    const activeLocationCount = locations.filter((location) => location.is_active).length;
    const cityCount = new Set(locations.map((location) => location.city).filter(Boolean)).size;
    const selectedLocation = locations.find((location) => location.id === selectedLocationId) ?? locations[0] ?? null;

    return (
        <AdminLayout
            title="Store locations"
            section="locations"
            description="Keep store data, storefront visibility, and branch ordering aligned in one operational workspace."
            toolbarSearchValue={filters.q}
            toolbarSearchAction={route('admin.locations')}
            toolbarSearchPlaceholder="Search locations by store, city, or address..."
        >
            <div className="space-y-8">
                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Location filters</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Search the store network</h2>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">
                                Filter the workspace by store name, city, address, or active status before updating branch details.
                            </p>
                        </div>

                        <form action={route('admin.locations')} method="get" className="grid gap-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4 md:grid-cols-[1fr_180px_auto_auto]">
                            <Input name="q" defaultValue={filters.q} placeholder="Search by store, city, or address" />
                            <select name="status" defaultValue={filters.status} className="cbx-field text-sm">
                                <option value="all">All statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <Button type="submit" variant="secondary">Apply</Button>
                            <Link href={route('admin.locations')} className="inline-flex items-center justify-center rounded-lg border border-[var(--cbx-outline-variant)] px-4 py-2 text-sm font-semibold text-[var(--cbx-on-surface)] transition-colors hover:bg-[var(--cbx-surface-container-low)]">Reset</Link>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="cbx-kicker">Location actions</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Add store location</h2>
                                <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Create new branches here, then refine hours, services, and storefront visibility in the workspace.</p>
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
                                <p className="cbx-kicker">Workspace rules</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Visibility and ordering</h2>
                            </div>
                            <div className="grid gap-3 text-sm text-[var(--cbx-on-surface-variant)]">
                                <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">Use active status for storefront visibility</p>
                                    <p className="mt-2">Keep draft or seasonal branches inactive until the listing should appear publicly.</p>
                                </div>
                                <div className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">Sort order controls the public branch sequence</p>
                                    <p className="mt-2">Update ordering in the workspace below so city pages and support content stay consistent.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="cbx-kicker">Workspace</p>
                            <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Manage locations</h2>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-[780px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)]">
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Store</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">City</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Contact</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Hours</th>
                                            <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Status</th>
                                            <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-[0.05em] text-[var(--cbx-on-surface-variant)]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {locations.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-14 text-center text-sm text-[var(--cbx-on-surface-variant)]">Store locations will appear here after the first save.</td>
                                            </tr>
                                        ) : locations.map((location) => {
                                            const isSelected = selectedLocation?.id === location.id;

                                            return (
                                                <tr key={location.id} className={`border-b border-[var(--cbx-border-subtle)] last:border-b-0 hover:bg-[var(--cbx-surface-alt)] ${isSelected ? 'bg-[var(--cbx-surface-alt)]' : ''}`}>
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-[var(--cbx-on-surface)]">{location.name}</div>
                                                        <div className="text-xs text-[var(--cbx-on-surface-variant)]">Sort #{location.sort_order}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface)]">{location.city}</td>
                                                    <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{location.phone}</td>
                                                    <td className="px-4 py-3 text-sm text-[var(--cbx-on-surface-variant)]">{location.hours}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.05em] ${location.is_active ? 'bg-[rgba(71,137,71,0.12)] text-[var(--cbx-brand-green)]' : 'bg-[var(--cbx-surface-container-low)] text-[var(--cbx-on-surface-variant)]'}`}>
                                                            {location.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedLocationId(location.id)}>Edit</Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-4 p-4 lg:hidden">
                                {locations.length === 0 ? (
                                    <p className="rounded-lg border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">Store locations will appear here after the first save.</p>
                                ) : locations.map((location) => (
                                    <div key={location.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-[var(--cbx-on-surface)]">{location.name}</p>
                                                <p className="text-sm text-[var(--cbx-on-surface-variant)]">{location.city} · {location.phone}</p>
                                            </div>
                                            <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.05em] ${location.is_active ? 'bg-[rgba(71,137,71,0.12)] text-[var(--cbx-brand-green)]' : 'bg-[var(--cbx-surface-container-low)] text-[var(--cbx-on-surface-variant)]'}`}>
                                                {location.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="mt-3 grid gap-1 text-sm text-[var(--cbx-on-surface-variant)]">
                                            <p>Hours: {location.hours}</p>
                                            <p>Sort order: {location.sort_order}</p>
                                        </div>
                                        <div className="mt-4">
                                            <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedLocationId(location.id)}>Edit</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedLocation ? (
                            <div className="space-y-3 rounded-xl border border-[var(--cbx-border-subtle)] p-4">
                                <div>
                                    <p className="cbx-kicker">Selected record</p>
                                    <h3 className="mt-2 font-heading text-xl font-semibold text-[var(--cbx-on-surface)]">Edit {selectedLocation.name}</h3>
                                </div>
                                <LocationEditor key={selectedLocation.id} location={selectedLocation} />
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardContent>
                            <p className="cbx-kicker">Filtered locations</p>
                            <p className="mt-4 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">{locations.length}</p>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Branches currently visible in this workspace result set.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <p className="cbx-kicker">Active storefront branches</p>
                            <p className="mt-4 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">{activeLocationCount}</p>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Locations marked live for storefront discovery.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <p className="cbx-kicker">Cities covered</p>
                            <p className="mt-4 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">{cityCount}</p>
                            <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">Distinct cities represented by the filtered branch list.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
