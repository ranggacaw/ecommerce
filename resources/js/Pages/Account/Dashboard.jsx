import StatCard from '@/Components/StatCard';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import AccountLayout from '@/Layouts/AccountLayout';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

function formatLabel(value) {
    if (!value) return 'Unavailable';

    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase());
}

function orderStatusAccent(status) {
    switch (status) {
        case 'delivered':
            return {
                dot: 'bg-[var(--cbx-brand-green)]',
                text: 'text-[var(--cbx-brand-green)]',
            };
        case 'cancelled':
            return {
                dot: 'bg-[var(--cbx-secondary)]',
                text: 'text-[var(--cbx-secondary)]',
            };
        case 'in_transit':
        case 'shipped':
            return {
                dot: 'bg-[var(--cbx-accent-gold)]',
                text: 'text-[var(--cbx-accent-gold)]',
            };
        default:
            return {
                dot: 'bg-[var(--cbx-primary)]',
                text: 'text-[var(--cbx-on-surface)]',
            };
    }
}

function formatOrderDate(value) {
    if (!value) return 'Date unavailable';

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return 'Date unavailable';
    }

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function Dashboard({ user, orders, addresses, wishlistCount }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [recentOnly, setRecentOnly] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = orders.filter((order) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const matchesSearch = !normalizedSearch || order.number?.toLowerCase().includes(normalizedSearch);
        const matchesStatus = statusFilter === 'all' || order.fulfillment_status === statusFilter;

        if (!recentOnly) {
            return matchesSearch && matchesStatus;
        }

        const referenceDate = order.placed_at || order.created_at;

        if (!referenceDate) {
            return false;
        }

        const placedAt = new Date(referenceDate);

        if (Number.isNaN(placedAt.getTime())) {
            return false;
        }

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        return matchesSearch && matchesStatus && placedAt >= threeMonthsAgo;
    });

    const hasFilters = searchTerm.trim() || recentOnly || statusFilter !== 'all';

    return (
        <AccountLayout title="Account overview">
            <section className="grid gap-6 border-b border-[var(--cbx-border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
                <div>
                    <p className="cbx-kicker">Account overview</p>
                    <h1 className="mt-3 font-heading text-4xl font-black tracking-[-0.04em] text-[var(--cbx-on-surface)] sm:text-5xl">
                        Track every order without losing your account essentials.
                    </h1>
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] sm:text-base sm:leading-8">
                        The dashboard leads with purchase activity, then keeps profile details, saved addresses, and re-engagement paths nearby instead of scattering them across separate screens.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    <StatCard label="Orders" value={orders.length} help="Recent and past purchases in one timeline." />
                    <StatCard label="Saved addresses" value={addresses.length} help="Checkout-ready delivery details." />
                    <StatCard label="Wishlist" value={wishlistCount} help="Products saved for the next drop." />
                </div>
            </section>

            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <label className="flex w-full items-center gap-3 rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] px-4 py-3 transition-colors focus-within:border-[var(--cbx-primary)] focus-within:ring-1 focus-within:ring-[var(--cbx-primary)] lg:max-w-md">
                    <svg
                        className="h-5 w-5 flex-shrink-0 text-[var(--cbx-neutral-mid)]"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M14.1667 14.1667L17.5 17.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <circle
                            cx="8.75"
                            cy="8.75"
                            r="5.75"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="w-full border-0 bg-transparent p-0 text-sm text-[var(--cbx-on-surface)] placeholder:text-[var(--cbx-neutral-mid)] focus:ring-0"
                        placeholder="Search by order ID"
                        aria-label="Search orders by order ID"
                    />
                </label>

                <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto lg:flex-nowrap lg:items-center">
                    <label className="sr-only" htmlFor="order-status-filter">Filter orders by status</label>
                    <select
                        id="order-status-filter"
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="cbx-field min-h-[48px] w-full rounded-sm px-4 py-3 text-sm font-medium tracking-normal focus:border-[var(--cbx-primary)] focus:ring-[var(--cbx-primary)] sm:w-auto sm:min-w-[180px] lg:flex-none"
                    >
                        <option value="all">All statuses</option>
                        <option value="awaiting_fulfillment">Awaiting fulfillment</option>
                        <option value="ready_to_ship">Ready to ship</option>
                        <option value="shipped">Shipped</option>
                        <option value="in_transit">In transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                        type="button"
                        onClick={() => setRecentOnly((value) => !value)}
                        aria-pressed={recentOnly}
                        className={`cbx-button min-h-[48px] w-full rounded-sm px-5 py-3 text-sm font-medium tracking-normal transition-all sm:w-auto sm:whitespace-nowrap lg:flex-none ${recentOnly ? 'cbx-button-primary' : 'cbx-button-secondary'}`}
                    >
                        {recentOnly ? 'Showing last 3 months' : 'Last 3 months'}
                    </button>
                    {hasFilters ? (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setRecentOnly(false);
                                setStatusFilter('all');
                            }}
                            className="cbx-button cbx-button-ghost min-h-[48px] w-full rounded-sm px-5 py-3 text-sm font-medium tracking-normal text-[var(--cbx-secondary)] transition-colors hover:bg-[var(--cbx-secondary)]/10 sm:w-auto sm:whitespace-nowrap lg:flex-none"
                        >
                            Clear filters
                        </button>
                    ) : null}
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.95fr)]">
                <div className="space-y-4">
                    {filteredOrders.length ? filteredOrders.map((order) => {
                        const accent = orderStatusAccent(order.fulfillment_status);

                        return (
                            <Card key={order.id}>
                                <CardContent className="p-5 sm:p-6">
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="lg:w-64">
                                            <p className="cbx-kicker">Order ID</p>
                                            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                                {order.number}
                                            </h2>
                                            <p className="mt-3 text-sm text-[var(--cbx-on-surface-variant)]">
                                                {order.items.length} items in this order
                                            </p>
                                            <p className="mt-1 text-sm text-[var(--cbx-neutral-mid)]">
                                                Placed on {formatOrderDate(order.placed_at || order.created_at)}
                                            </p>
                                        </div>

                                        <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-end">
                                            <div>
                                                <p className="cbx-kicker">Status</p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className={`h-2.5 w-2.5 rounded-sm ${accent.dot}`} />
                                                    <span className={`text-sm font-semibold uppercase tracking-[0.08em] ${accent.text}`}>
                                                        {formatLabel(order.fulfillment_status)}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--cbx-on-surface-variant)]">
                                                    Payment {formatLabel(order.payment_status)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="cbx-kicker">Total amount</p>
                                                <p className="mt-3 font-heading text-2xl font-bold text-[var(--cbx-primary)]">
                                                    {formatCurrency(order.grand_total)}
                                                </p>
                                            </div>

                                            <div className="flex items-end lg:justify-end">
                                                <Link
                                                    href={route('orders.show-public', order.number)}
                                                    className="cbx-button cbx-button-primary w-full px-5 py-3 text-center text-xs uppercase tracking-[0.14em] sm:w-auto"
                                                >
                                                    View details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    }) : (
                        <Card>
                            <CardContent className="p-6 text-sm text-[var(--cbx-on-surface-variant)]">
                                {orders.length
                                    ? 'No orders match the current search or filter.'
                                    : 'You have not placed an order yet.'}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <aside className="space-y-4">
                    <Card>
                        <CardContent className="space-y-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="cbx-kicker">Profile</p>
                                    <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                        {user.name}
                                    </h2>
                                </div>
                                <Link href={route('profile.edit')} className="text-sm font-semibold text-[var(--cbx-secondary)]">
                                    Edit profile
                                </Link>
                            </div>
                            <div className="space-y-3 text-sm text-[var(--cbx-on-surface-variant)]">
                                <p>{user.email}</p>
                                <p>{user.phone || 'No phone number saved yet.'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="space-y-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="cbx-kicker">Addresses</p>
                                    <h2 className="mt-3 font-heading text-xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                        Default delivery
                                    </h2>
                                </div>
                                <Link href={route('account.addresses')} className="text-sm font-semibold text-[var(--cbx-secondary)]">
                                    Manage
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {addresses.slice(0, 2).map((address) => (
                                    <div key={address.id} className="rounded-sm border border-[var(--cbx-border-subtle)] p-4 text-sm text-[var(--cbx-on-surface-variant)]">
                                        {address.is_default ? <Badge className="mb-3 border-emerald-300 bg-emerald-50 text-emerald-700">Default</Badge> : null}
                                        <p className="font-semibold text-[var(--cbx-on-surface)]">{address.recipient_name}</p>
                                        <p className="mt-1">{address.line1}</p>
                                        <p className="text-[var(--cbx-neutral-mid)]">{address.city}, {address.province}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)]">
                        <CardContent>
                            <p className="cbx-kicker text-white/70">Recommended next</p>
                            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-white">
                                Browse new arrivals before the next drop disappears.
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-white/75">
                                A dashboard should stay practical, but it can still provide a strong path back into shopping.
                            </p>
                            <Link
                                href={route('home')}
                                className="mt-6 inline-flex items-center border border-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-[var(--cbx-primary)]"
                            >
                                Shop new arrivals
                            </Link>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </AccountLayout>
    );
}
