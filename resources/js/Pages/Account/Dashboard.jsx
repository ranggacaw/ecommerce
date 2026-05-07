import StatCard from '@/Components/StatCard';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import AccountLayout from '@/Layouts/AccountLayout';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function Dashboard({ user, orders, addresses, wishlistCount }) {
    return (
        <AccountLayout title="Account overview">
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard label="Orders" value={orders.length} help="Track payment and delivery progress from one place." />
                <StatCard label="Saved addresses" value={addresses.length} help="Reuse delivery details during checkout." />
                <StatCard label="Wishlist" value={wishlistCount} help="Keep products saved until you are ready to buy." />
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <Card>
                    <CardContent className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="cbx-kicker">Profile</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">{user.name}</h2>
                            </div>
                            <Link href={route('profile.edit')} className="text-sm font-semibold text-[var(--cbx-secondary)]">Edit profile</Link>
                        </div>
                        <div className="space-y-3 text-sm text-[var(--cbx-on-surface-variant)]">
                            <p>{user.email}</p>
                            <p>{user.phone || 'No phone number saved yet.'}</p>
                        </div>
                        <div className="space-y-4 border-t border-[var(--cbx-border-subtle)] pt-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-heading text-lg font-semibold text-[var(--cbx-on-surface)]">Default addresses</h3>
                                <Link href={route('account.addresses')} className="text-sm font-semibold text-[var(--cbx-secondary)]">Manage</Link>
                            </div>
                            {addresses.slice(0, 2).map((address) => (
                                <div key={address.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                    {address.is_default ? <Badge className="mb-3 border-emerald-300 bg-emerald-50 text-emerald-700">Default</Badge> : null}
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{address.recipient_name}</p>
                                    <p className="mt-1">{address.line1}</p>
                                    <p className="text-[var(--cbx-neutral-mid)]">{address.city}, {address.province}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="cbx-kicker">Order history</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Recent purchases</h2>
                            </div>
                            <Link href={route('account.wishlist')} className="text-sm font-semibold text-[var(--cbx-secondary)]">Wishlist</Link>
                        </div>
                        <div className="space-y-4">
                            {orders.length ? orders.map((order) => (
                                <div key={order.id} className="rounded-xl border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="font-semibold text-[var(--cbx-on-surface)]">{order.number}</p>
                                            <p className="text-[var(--cbx-neutral-mid)]">{order.items.length} items · {formatCurrency(order.grand_total)}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge>{order.payment_status}</Badge>
                                            <Badge>{order.fulfillment_status}</Badge>
                                        </div>
                                    </div>
                                    <Link href={route('orders.show-public', order.number)} className="mt-3 inline-flex text-sm font-semibold text-[var(--cbx-secondary)]">Open order detail</Link>
                                </div>
                            )) : <p className="text-[var(--cbx-on-surface-variant)]">You have not placed an order yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AccountLayout>
    );
}
