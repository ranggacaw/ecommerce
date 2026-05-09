import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { formatCurrency } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { CircleHelp, Copy, CreditCard, MapPin, Package, Printer, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';

function formatLabel(value) {
    if (!value) return 'Unavailable';

    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatOrderDate(value) {
    if (!value) return 'Date unavailable';

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return 'Date unavailable';
    }

    return parsed.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function addressLines(address = {}) {
    return [
        address.line1,
        address.line2,
        [address.city, address.province, address.postal_code].filter(Boolean).join(', '),
        address.country,
    ].filter(Boolean);
}

export default function OrderShow({ order }) {
    const [copiedTracking, setCopiedTracking] = useState(false);

    const placedAtLabel = useMemo(() => formatOrderDate(order.placed_at), [order.placed_at]);
    const shipment = order.shipment;
    const payment = order.payment;
    const shippingLines = useMemo(() => addressLines(order.address), [order.address]);
    const hasDiscount = Number(order.discount_total || 0) > 0;

    const buyAgain = (variantId) => {
        if (!variantId) {
            return;
        }

        router.post(route('cart.store'), { variant_id: variantId, quantity: 1 }, { preserveScroll: true });
    };

    const copyTrackingNumber = async () => {
        if (!shipment?.tracking_number || !navigator?.clipboard) {
            return;
        }

        await navigator.clipboard.writeText(shipment.tracking_number);
        setCopiedTracking(true);
        window.setTimeout(() => setCopiedTracking(false), 2000);
    };

    return (
        <StorefrontLayout title={`Order ${order.number}`}>
            {/* Section: Header */}
            <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="cbx-kicker">Order details</p>
                    <h1 className="mt-3 font-heading text-4xl font-black uppercase tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-5xl">
                        {order.number}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex rounded-sm bg-[var(--cbx-brand-green)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                            {formatLabel(order.status)}
                        </span>
                        <span className="text-sm text-[var(--cbx-on-surface-variant)]">
                            Placed on <span className="font-semibold text-[var(--cbx-on-surface)]">{placedAtLabel}</span>
                        </span>
                    </div>
                </div>

                {shipment?.tracking_number ? (
                    <Button type="button" onClick={copyTrackingNumber} className="gap-2 text-xs uppercase tracking-[0.14em]">
                        <Truck className="h-4 w-4" />
                        {copiedTracking ? 'Tracking copied' : 'Copy tracking number'}
                    </Button>
                ) : (
                    <Link
                        href={`${route('storefront.contact')}?topic=shipping&orderNumber=${encodeURIComponent(order.number)}`}
                        className="cbx-button cbx-button-primary gap-2 px-5 py-3 text-xs uppercase tracking-[0.14em]"
                    >
                        <CircleHelp className="h-4 w-4" />
                        Get delivery help
                    </Link>
                )}
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
                {/* Section: Items And Fulfillment */}
                <div className="space-y-5 lg:col-span-8">
                    <Card>
                        <CardContent>
                            <div className="flex flex-col gap-3 border-b border-[var(--cbx-border-subtle)] pb-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                        Order Items ({order.items.length})
                                    </h2>
                                    <p className="mt-1 text-sm text-[var(--cbx-on-surface-variant)]">
                                        Review the products included in this order and jump back into the catalog when needed.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em] text-[var(--cbx-on-surface-variant)]">
                                    <span className="rounded-sm border border-[var(--cbx-border-subtle)] px-3 py-1">
                                        Payment {formatLabel(order.payment_status)}
                                    </span>
                                    <span className="rounded-sm border border-[var(--cbx-border-subtle)] px-3 py-1">
                                        Fulfillment {formatLabel(order.fulfillment_status)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-6">
                                {order.items.length ? order.items.map((item, index) => (
                                    <article
                                        key={item.id}
                                        className={`flex flex-col gap-5 sm:flex-row ${index > 0 ? 'border-t border-[var(--cbx-border-subtle)] pt-6' : ''}`}
                                    >
                                        <div className="h-60 overflow-hidden bg-[var(--cbx-surface-container-low)] sm:h-auto sm:w-28 sm:flex-none">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full min-h-48 items-center justify-center text-[var(--cbx-on-surface-variant)]">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--cbx-on-surface-variant)]">
                                                        {item.brand || 'COLORBOX'}
                                                    </p>
                                                    <h3 className="mt-1 font-heading text-xl font-semibold uppercase tracking-[-0.02em] text-[var(--cbx-on-surface)]">
                                                        {item.product_name}
                                                    </h3>
                                                    <div className="mt-2 space-y-1 text-sm text-[var(--cbx-on-surface-variant)]">
                                                        <p>Variant: <span className="font-semibold text-[var(--cbx-on-surface)]">{item.variant_name || 'Standard'}</span></p>
                                                        <p>Qty: <span className="font-semibold text-[var(--cbx-on-surface)]">{item.quantity}</span></p>
                                                        {item.sku ? <p>SKU: <span className="font-semibold text-[var(--cbx-on-surface)]">{item.sku}</span></p> : null}
                                                    </div>
                                                </div>

                                                <div className="sm:text-right">
                                                    <p className="font-heading text-2xl font-bold text-[var(--cbx-primary)]">
                                                        {formatCurrency(item.total_price)}
                                                    </p>
                                                    {Number(item.quantity) > 1 ? (
                                                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--cbx-on-surface-variant)]">
                                                            {formatCurrency(item.unit_price)} each
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {item.product_slug ? (
                                                    <Link
                                                        href={route('products.show', item.product_slug)}
                                                        className="inline-flex items-center text-xs font-bold uppercase tracking-[0.14em] text-[var(--cbx-primary)] underline underline-offset-4 transition hover:text-[var(--cbx-secondary)]"
                                                    >
                                                        View product
                                                    </Link>
                                                ) : null}

                                                <button
                                                    type="button"
                                                    onClick={() => buyAgain(item.product_variant_id)}
                                                    disabled={!item.product_variant_id}
                                                    className="inline-flex items-center text-xs font-bold uppercase tracking-[0.14em] text-[var(--cbx-primary)] underline underline-offset-4 transition hover:text-[var(--cbx-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Buy again
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                )) : (
                                    <div className="border border-dashed border-[var(--cbx-border-subtle)] p-6 text-sm text-[var(--cbx-on-surface-variant)]">
                                        This order does not have any visible items.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section: Address Payment Shipment */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Card>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-[var(--cbx-brand-pink)]" />
                                    <h2 className="font-heading text-lg font-semibold text-[var(--cbx-on-surface)]">Shipping Address</h2>
                                </div>
                                <div className="mt-4 space-y-1.5 text-sm text-[var(--cbx-on-surface-variant)]">
                                    <p className="font-semibold text-[var(--cbx-on-surface)]">{order.address?.recipient_name || 'Recipient unavailable'}</p>
                                    {shippingLines.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                    {order.address?.phone ? <p>{order.address.phone}</p> : null}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-[var(--cbx-accent-gold)]" />
                                    <h2 className="font-heading text-lg font-semibold text-[var(--cbx-on-surface)]">Payment Method</h2>
                                </div>
                                {payment ? (
                                    <div className="mt-4 space-y-2 text-sm text-[var(--cbx-on-surface-variant)]">
                                        <p className="font-semibold uppercase tracking-[0.12em] text-[var(--cbx-on-surface)]">{payment.method}</p>
                                        <p>Provider: <span className="font-semibold text-[var(--cbx-on-surface)]">{payment.provider}</span></p>
                                        <p>Status: <span className="font-semibold text-[var(--cbx-on-surface)]">{formatLabel(payment.status)}</span></p>
                                        {payment.external_reference ? <p>Reference: <span className="font-semibold text-[var(--cbx-on-surface)]">{payment.external_reference}</span></p> : null}
                                    </div>
                                ) : (
                                    <p className="mt-4 text-sm text-[var(--cbx-on-surface-variant)]">Payment details are not available yet.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardContent>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-5 w-5 text-[var(--cbx-primary)]" />
                                            <h2 className="font-heading text-lg font-semibold text-[var(--cbx-on-surface)]">Shipment</h2>
                                        </div>
                                        {shipment ? (
                                            <div className="mt-4 grid gap-2 text-sm text-[var(--cbx-on-surface-variant)] sm:grid-cols-2 lg:grid-cols-4">
                                                <p>Service: <span className="font-semibold text-[var(--cbx-on-surface)]">{shipment.service_name}</span></p>
                                                <p>Status: <span className="font-semibold text-[var(--cbx-on-surface)]">{formatLabel(shipment.status)}</span></p>
                                                <p>Tracking: <span className="font-semibold text-[var(--cbx-on-surface)]">{shipment.tracking_number || 'Pending'}</span></p>
                                                <p>Destination: <span className="font-semibold text-[var(--cbx-on-surface)]">{shipment.destination_summary || 'Preparing shipment'}</span></p>
                                            </div>
                                        ) : (
                                            <p className="mt-4 text-sm text-[var(--cbx-on-surface-variant)]">Shipment details will appear once the order is prepared.</p>
                                        )}
                                    </div>

                                    {shipment?.tracking_number ? (
                                        <Button type="button" variant="secondary" onClick={copyTrackingNumber} className="gap-2 text-xs uppercase tracking-[0.14em]">
                                            <Copy className="h-4 w-4" />
                                            {copiedTracking ? 'Copied' : ''}
                                        </Button>
                                    ) : null}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Section: Summary Sidebar */}
                <aside className="lg:col-span-4 lg:sticky lg:top-24">
                    <Card className="overflow-hidden border-0 bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)]">
                        <CardContent className="p-8">
                            <h2 className="font-heading text-2xl font-bold uppercase tracking-[-0.03em] text-white/70">Order Summary</h2>

                            <div className="mt-6 space-y-4 border-b border-white/15 pb-6">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm uppercase tracking-[0.12em] text-white/70">Subtotal</span>
                                    <span className="font-heading text-xl font-bold">{formatCurrency(order.subtotal)}</span>
                                </div>
                                {hasDiscount ? (
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm uppercase tracking-[0.12em] text-white/70">Discount</span>
                                        <span className="font-heading text-xl font-bold text-[var(--cbx-brand-green)]">-{formatCurrency(order.discount_total)}</span>
                                    </div>
                                ) : null}
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm uppercase tracking-[0.12em] text-white/70">Shipping</span>
                                    <span className="font-heading text-xl font-bold">{Number(order.shipping_total) > 0 ? formatCurrency(order.shipping_total) : 'FREE'}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between gap-4">
                                <span className="font-heading text-lg font-bold uppercase tracking-[0.08em]">Total</span>
                                <span className="font-heading text-3xl font-black">{formatCurrency(order.grand_total)}</span>
                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                                <Button type="button" variant="secondary" className="w-full gap-2 text-xs uppercase tracking-[0.14em]" onClick={() => window.print()}>
                                    <Printer className="h-4 w-4" />
                                    Print order details
                                </Button>
                                <Link
                                    href={`${route('storefront.contact')}?topic=order&orderNumber=${encodeURIComponent(order.number)}`}
                                    className="cbx-button w-full justify-center border border-white bg-transparent px-5 py-3 text-center text-xs uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                                >
                                    Need help?
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </StorefrontLayout>
    );
}
