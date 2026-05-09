import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Link } from '@inertiajs/react';
import { ArrowRight, Mail, MessageCircle, PhoneCall } from 'lucide-react';
import { useState } from 'react';

const supportChannels = [
    {
        title: 'WhatsApp support',
        value: '+62 811-1234-5678',
        detail: 'Available Mon-Fri, 9am - 6pm WIB',
        href: 'https://wa.me/6281112345678',
        Icon: MessageCircle,
    },
    {
        title: 'Email support',
        value: 'hello@colorbox.local',
        detail: 'Best for order updates, returns, and product questions',
        href: 'mailto:hello@colorbox.local',
        Icon: Mail,
    },
    {
        title: 'Phone line',
        value: '+62 21 5555 0188',
        detail: 'Toll-free support for urgent delivery follow-up',
        href: 'tel:+622155550188',
        Icon: PhoneCall,
    },
];

const topicOptions = [
    { value: 'order', label: 'Order inquiry' },
    { value: 'return', label: 'Returns and exchanges' },
    { value: 'shipping', label: 'Shipping status' },
    { value: 'product', label: 'Product information' },
    { value: 'partnership', label: 'Partnership inquiry' },
    { value: 'other', label: 'Other' },
];

export default function ContactUs() {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

    const [form, setForm] = useState({
        name: '',
        email: '',
        topic: params?.get('topic') || '',
        orderNumber: params?.get('orderNumber') || '',
        message: '',
    });

    const setField = (field) => (event) => {
        setForm((current) => ({
            ...current,
            [field]: event.target.value,
        }));
    };

    const submitMessage = (event) => {
        event.preventDefault();

        const selectedTopic = topicOptions.find((option) => option.value === form.topic)?.label || 'General question';
        const bodyLines = [
            `Name: ${form.name}`,
            `Email: ${form.email}`,
            `Topic: ${selectedTopic}`,
        ];

        if (form.orderNumber.trim()) {
            bodyLines.push(`Order number: ${form.orderNumber.trim()}`);
        }

        bodyLines.push('', form.message.trim());

        window.location.href = `mailto:hello@colorbox.local?subject=${encodeURIComponent(`[COLORBOX] ${selectedTopic}`)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    };

    return (
        <StorefrontLayout title="Contact Us">
            {/* Section: Contact Intro */}
            <section className="grid gap-6 rounded-sm py-6 px-0 shadow-[var(--cbx-shadow-soft)] xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-end">
                <div>
                    <p className="cbx-kicker">Support</p>
                    <h1 className="mt-3 font-heading text-4xl font-black tracking-[-0.04em] text-[var(--cbx-on-surface)] sm:text-5xl lg:text-6xl">
                        Get in touch
                    </h1>
                    <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] lg:text-lg lg:leading-8">
                        Questions about products, orders, account access, or store services can be routed through the customer experience team in one place.
                    </p>
                </div>
            </section>

            {/* Section: Contact Grid */}
            <section className="grid gap-12 xl:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
                {/* Section: Contact Form */}
                <section className="cbx-card p-6 sm:p-8 lg:p-10 rounded-sm">
                    <div className="max-w-2xl">
                        <p className="cbx-kicker">Send a message</p>
                        <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-4xl">
                            Customer experience team
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">
                            This form opens your default email app with the message prefilled, so you can send support details with the right structure immediately.
                        </p>
                    </div>

                    <form onSubmit={submitMessage} className="mt-8 space-y-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="space-y-2">
                                <span className="cbx-kicker text-[var(--cbx-on-surface)]">Name</span>
                                <Input value={form.name} onChange={setField('name')} placeholder="Your full name" required />
                            </label>

                            <label className="space-y-2">
                                <span className="cbx-kicker text-[var(--cbx-on-surface)]">Email</span>
                                <Input value={form.email} onChange={setField('email')} placeholder="hello@example.com" type="email" required />
                            </label>
                        </div>

                        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]">
                            <label className="space-y-2">
                                <span className="cbx-kicker text-[var(--cbx-on-surface)]">Topic</span>
                                <select value={form.topic} onChange={setField('topic')} className="cbx-field text-sm" required>
                                    <option value="">Select a topic</option>
                                    {topicOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-2">
                                <span className="cbx-kicker text-[var(--cbx-on-surface)]">Order number</span>
                                <Input value={form.orderNumber} onChange={setField('orderNumber')} placeholder="Optional" />
                            </label>
                        </div>

                        <label className="block space-y-2">
                            <span className="cbx-kicker text-[var(--cbx-on-surface)]">Message</span>
                            <Textarea value={form.message} onChange={setField('message')} placeholder="How can we help you?" rows={6} required />
                        </label>

                        <div className="flex flex-col gap-2 border-t border-[var(--cbx-border-subtle)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-md text-xs leading-6 text-[var(--cbx-on-surface-variant)]">
                                Need a quicker answer for active orders? WhatsApp is the fastest path during business hours.
                            </p>
                            <Button type="submit" className="w-full rounded-full px-8 py-4 text-xs uppercase tracking-[0.18em] sm:w-auto">
                                Send message
                            </Button>
                        </div>
                    </form>
                </section>

                {/* Section: Support Sidebar */}
                <div className="space-y-6">
                    {/* Section: Support Channels */}
                    <section className="overflow-hidden rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-high)]">
                        <div className="px-6 py-6 sm:px-8">
                            <p className="cbx-kicker">Support channels</p>
                            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                Pick the channel that matches the urgency.
                            </h2>
                        </div>

                        <div className="border-t border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]">
                            {supportChannels.map(({ title, value, detail, href, Icon }) => (
                                <a
                                    key={title}
                                    href={href}
                                    target={href.startsWith('https') ? '_blank' : undefined}
                                    rel={href.startsWith('https') ? 'noreferrer' : undefined}
                                    className="flex items-start gap-4 border-b border-[var(--cbx-border-subtle)] px-6 py-5 transition hover:bg-[var(--cbx-surface-container-low)] last:border-b-0 sm:px-8"
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)]">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="cbx-kicker text-[var(--cbx-on-surface)]">{title}</span>
                                        <span className="mt-1 block font-heading text-sm font-semibold tracking-[-0.02em] text-[var(--cbx-on-surface)]">
                                            {value}
                                        </span>
                                        <span className="mt-0 block text-sm leading-6 text-[var(--cbx-on-surface-variant)]">
                                            {detail}
                                        </span>
                                    </span>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Section: FAQ Card */}
                    <section className="relative overflow-hidden rounded-sm bg-[var(--cbx-primary)] p-6 text-[var(--cbx-on-primary)] sm:p-8">
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full border border-white/15" />
                        <div className="absolute bottom-0 right-10 h-20 w-20 translate-y-8 rounded-full bg-white/10" />
                        <div className="relative">
                            <p className="cbx-kicker text-white/70">Need a quick answer?</p>
                            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-white/70">
                                Start with terms, policy, and service basics.
                            </h2>
                            <p className="mt-3 max-w-sm text-sm leading-7 text-white/80">
                                For shipping windows, exchange expectations, and account handling, the help content usually answers the first round of questions fast.
                            </p>
                            <Link
                                href={route('storefront.terms')}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--cbx-primary)] transition hover:bg-[var(--cbx-surface-container-highest)]"
                            >
                                View terms & policy
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>

                    {/* Section: In-Person Support */}
                    <section className="relative overflow-hidden rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)] p-6 sm:p-8">
                        <div className="absolute inset-y-0 right-0 hidden w-32 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.12),_transparent_70%)] sm:block" />
                        <div className="relative">
                            <p className="cbx-kicker">Visit in person</p>
                            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                Prefer face-to-face support?
                            </h2>
                            <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--cbx-on-surface-variant)]">
                                Store teams can help with sizing guidance, pickup questions, and collection availability before you place an order.
                            </p>
                            <Link href={route('storefront.location')} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--cbx-primary)] transition hover:text-[var(--cbx-secondary)]">
                                Open store locations
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>
                </div>
            </section>
        </StorefrontLayout>
    );
}
