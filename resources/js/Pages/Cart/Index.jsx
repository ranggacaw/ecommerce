import { Button } from '@/Components/ui/Button';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { formatCurrency, productPrimaryImage } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import { CreditCard, Lock, Minus, Plus, ShieldCheck, Trash2, Truck } from 'lucide-react';

export default function CartIndex({ cart }) {
    const { auth } = usePage().props;
    const subtotal = cart?.items?.reduce((carry, item) => carry + Number(item.line_total || 0), 0) || 0;
    const itemCount = cart?.items?.reduce((carry, item) => carry + Number(item.quantity || 0), 0) || 0;

    const updateQuantity = (item, nextQuantity) => {
        const quantity = Math.max(1, Math.min(20, nextQuantity));

        router.patch(route('cart.update', item.id), { quantity }, { preserveScroll: true });
    };

    return (
        <StorefrontLayout title="Shopping Bag">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-5xl">Shopping Bag</h1>
                <p className="max-w-2xl text-base text-[var(--cbx-on-surface-variant)] sm:text-lg">Review your selections before heading to checkout.</p>
            </div>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
                <section className="min-w-0 flex-1">
                    {cart?.items?.length ? (
                        <div className="space-y-6">
                            {cart.items.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex flex-col gap-4 border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-4 sm:p-6 md:flex-row md:gap-6"
                                >
                                    <div className="h-56 overflow-hidden bg-[var(--cbx-surface-container)] sm:h-64 md:h-40 md:w-32 md:flex-none">
                                        <img
                                            src={productPrimaryImage(item.variant?.product)}
                                            alt={item.variant?.product?.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                                        <div>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <h2 className="font-heading text-xl font-semibold uppercase tracking-[-0.02em] text-[var(--cbx-on-surface)] sm:text-2xl">
                                                        {item.variant?.product?.name}
                                                    </h2>
                                                    <p className="mt-1 text-sm text-[var(--cbx-on-surface-variant)]">{item.variant?.display_name}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => router.delete(route('cart.destroy', item.id), { preserveScroll: true })}
                                                    className="inline-flex h-10 w-10 flex-none items-center justify-center text-[var(--cbx-on-surface-variant)] transition hover:text-[var(--cbx-error)]"
                                                    aria-label={`Remove ${item.variant?.product?.name} from cart`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                            <div className="inline-flex w-fit items-center border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item, Number(item.quantity) - 1)}
                                                    className="inline-flex h-11 w-11 items-center justify-center transition hover:bg-[var(--cbx-surface-container-low)] disabled:cursor-not-allowed disabled:opacity-40"
                                                    disabled={Number(item.quantity) <= 1}
                                                    aria-label={`Decrease quantity for ${item.variant?.product?.name}`}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="inline-flex h-11 min-w-12 items-center justify-center border-x border-[var(--cbx-border-subtle)] px-4 text-sm font-semibold text-[var(--cbx-on-surface)]">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item, Number(item.quantity) + 1)}
                                                    className="inline-flex h-11 w-11 items-center justify-center transition hover:bg-[var(--cbx-surface-container-low)]"
                                                    aria-label={`Increase quantity for ${item.variant?.product?.name}`}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="cbx-price text-lg text-[var(--cbx-primary)]">{formatCurrency(item.line_total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            <div className="border-t border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-alt)] p-6">
                                <p className="cbx-kicker text-[var(--cbx-on-surface)]">Promotional Code</p>
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                    <input
                                        type="text"
                                        disabled
                                        placeholder="Promo codes will be available soon"
                                        className="cbx-field flex-1 bg-white disabled:cursor-not-allowed disabled:opacity-70"
                                    />
                                    <Button type="button" disabled className="sm:px-6">Apply</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-8 sm:p-10">
                            <p className="cbx-kicker">Shopping bag</p>
                            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-[var(--cbx-on-surface)]">Your bag is empty.</h2>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--cbx-on-surface-variant)]">Explore the catalog to start building a look. Once you add pieces, they will appear here with quantity controls and checkout details.</p>
                            <Link href={route('shop.index')} className="cbx-button cbx-button-primary mt-6 px-6 py-3 text-sm">
                                Continue shopping
                            </Link>
                        </div>
                    )}
                </section>

                <aside className="w-full lg:w-[24rem] lg:flex-none">
                    <div className="border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-6 lg:sticky lg:top-24">
                        <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-[var(--cbx-on-surface)]">Order Summary</h2>

                        <div className="mt-6 space-y-4 text-sm text-[var(--cbx-on-surface-variant)]">
                            <div className="flex items-center justify-between gap-4">
                                <span>Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})</span>
                                <span className="text-[var(--cbx-on-surface)]">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span>Estimated shipping</span>
                                <span className="font-semibold text-[var(--cbx-accent-forest)]">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="mt-8 border-t-2 border-[var(--cbx-primary)] pt-4">
                            <div className="flex items-end justify-between gap-4">
                                <span className="font-heading text-2xl font-semibold text-[var(--cbx-on-surface)]">Total</span>
                                <span className="font-heading text-2xl font-bold text-[var(--cbx-primary)]">{formatCurrency(subtotal)}</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            {auth.user ? (
                                <Link href={route('checkout.create')} className="block">
                                    <Button className="w-full text-sm uppercase tracking-[0.18em]" size="lg" disabled={!cart?.items?.length}>
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={route('login')} className="block">
                                    <Button className="w-full text-sm uppercase tracking-[0.18em]" size="lg" disabled={!cart?.items?.length}>
                                        Sign in to Checkout
                                    </Button>
                                </Link>
                            )}

                            <Link href={route('shop.index')} className="cbx-button cbx-button-secondary w-full px-6 py-3 text-sm uppercase tracking-[0.18em]">
                                Continue Shopping
                            </Link>
                        </div>

                        {!auth.user ? (
                            <p className="mt-4 text-sm leading-6 text-[var(--cbx-on-surface-variant)]">Your bag stays saved. Sign in now and we will continue from this exact selection.</p>
                        ) : null}

                        <div className="mt-8 flex items-center justify-center gap-4 border-t border-[var(--cbx-border-subtle)] pt-6 text-[var(--cbx-on-surface-variant)] opacity-70">
                            <CreditCard className="h-4 w-4" />
                            <Lock className="h-4 w-4" />
                            <ShieldCheck className="h-4 w-4" />
                            <Truck className="h-4 w-4" />
                        </div>
                        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--cbx-on-surface-variant)]">Secure checkout experience</p>
                    </div>
                </aside>
            </div>
        </StorefrontLayout>
    );
}
