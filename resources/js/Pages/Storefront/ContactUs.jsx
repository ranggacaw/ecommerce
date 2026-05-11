import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Link } from '@inertiajs/react';
import { ArrowRight, Mail, MessageCircle, PhoneCall } from 'lucide-react';
import { useState } from 'react';

const supportIcons = {
    MessageCircle,
    Mail,
    PhoneCall,
};

export default function ContactUs({ contactContent }) {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const topicOptions = contactContent.form.topics;
    const supportChannels = contactContent.support.channels.map((channel) => ({
        ...channel,
        Icon: supportIcons[channel.icon] || MessageCircle,
    }));

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

        window.location.href = `mailto:${contactContent.form.email_recipient}?subject=${encodeURIComponent(`[COLORBOX] ${selectedTopic}`)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    };

    return (
        <StorefrontLayout title="Contact Us">
            <section className="grid gap-6 rounded-sm px-0 py-6 shadow-[var(--cbx-shadow-soft)] xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-end">
                <div>
                    <p className="cbx-kicker">{contactContent.intro.kicker}</p>
                    <h1 className="mt-3 font-heading text-4xl font-black tracking-[-0.04em] text-[var(--cbx-on-surface)] sm:text-5xl lg:text-6xl">
                        {contactContent.intro.title}
                    </h1>
                    <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] lg:text-lg lg:leading-8">
                        {contactContent.intro.description}
                    </p>
                </div>
            </section>

            <section className="grid gap-12 xl:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
                <section className="cbx-card rounded-sm p-6 sm:p-8 lg:p-10">
                    <div className="max-w-2xl">
                        <p className="cbx-kicker">{contactContent.form.kicker}</p>
                        <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-4xl">
                            {contactContent.form.title}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">
                            {contactContent.form.description}
                        </p>
                    </div>

                    <form onSubmit={submitMessage} className="mt-8 space-y-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="space-y-2">
                                <span className="cbx-kicker text-[var(--cbx-on-surface)]">{contactContent.form.name_label}</span>
                                <Input value={form.name} onChange={setField('name')} placeholder="Your full name" required />
                            </label>

                            <label className="space-y-2">
                                <span className="cbx-kicker text-[var(--cbx-on-surface)]">{contactContent.form.email_label}</span>
                                <Input value={form.email} onChange={setField('email')} placeholder="hello@example.com" type="email" required />
                            </label>
                        </div>

                        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]">
                            <label className="space-y-2">
                                <span className="cbx-kicker text-[var(--cbx-on-surface)]">{contactContent.form.topic_label}</span>
                                <select value={form.topic} onChange={setField('topic')} className="cbx-field text-sm" required>
                                    <option value="">{contactContent.form.topic_placeholder}</option>
                                    {topicOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-2">
                                <span className="cbx-kicker text-[var(--cbx-on-surface)]">{contactContent.form.order_number_label}</span>
                                <Input value={form.orderNumber} onChange={setField('orderNumber')} placeholder="Optional" />
                            </label>
                        </div>

                        <label className="block space-y-2">
                            <span className="cbx-kicker text-[var(--cbx-on-surface)]">{contactContent.form.message_label}</span>
                            <Textarea value={form.message} onChange={setField('message')} placeholder={contactContent.form.message_placeholder} rows={6} required />
                        </label>

                        <div className="flex flex-col gap-2 border-t border-[var(--cbx-border-subtle)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-md text-xs leading-6 text-[var(--cbx-on-surface-variant)]">{contactContent.form.submit_note}</p>
                            <Button type="submit" className="w-full rounded-full px-8 py-4 text-xs uppercase tracking-[0.18em] sm:w-auto">
                                {contactContent.form.submit_button_label}
                            </Button>
                        </div>
                    </form>
                </section>

                <div className="space-y-6">
                    <section className="overflow-hidden rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-high)]">
                        <div className="px-6 py-6 sm:px-8">
                            <p className="cbx-kicker">{contactContent.support.kicker}</p>
                            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                {contactContent.support.title}
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

                    <section className="relative overflow-hidden rounded-sm bg-[var(--cbx-primary)] p-6 text-[var(--cbx-on-primary)] sm:p-8">
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full border border-white/15" />
                        <div className="absolute bottom-0 right-10 h-20 w-20 translate-y-8 rounded-full bg-white/10" />
                        <div className="relative">
                            <p className="cbx-kicker text-white/70">{contactContent.faq.kicker}</p>
                            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-white/70">
                                {contactContent.faq.title}
                            </h2>
                            <p className="mt-3 max-w-sm text-sm leading-7 text-white/80">{contactContent.faq.description}</p>
                            <Link
                                href={route('storefront.terms')}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--cbx-primary)] transition hover:bg-[var(--cbx-surface-container-highest)]"
                            >
                                {contactContent.faq.button_label}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>

                    <section className="relative overflow-hidden rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)] p-6 sm:p-8">
                        <div className="absolute inset-y-0 right-0 hidden w-32 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.12),_transparent_70%)] sm:block" />
                        <div className="relative">
                            <p className="cbx-kicker">{contactContent.visit.kicker}</p>
                            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                {contactContent.visit.title}
                            </h2>
                            <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--cbx-on-surface-variant)]">{contactContent.visit.description}</p>
                            <Link href={route('storefront.location')} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--cbx-primary)] transition hover:text-[var(--cbx-secondary)]">
                                {contactContent.visit.button_label}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>
                </div>
            </section>
        </StorefrontLayout>
    );
}
