import StorefrontLayout from '@/Layouts/StorefrontLayout';

const channels = [
    {
        title: 'Customer support',
        content: 'Email hello@colorbox.local or call +62 21 5555 0188 for help with orders, sizing guidance, delivery follow-up, or return coordination.',
    },
    {
        title: 'Response windows',
        content: 'Messages sent during business hours are usually answered the same day. Weekend requests are reviewed on the next operating day.',
    },
    {
        title: 'Partnership inquiries',
        content: 'For campaigns, merchandising partnerships, or wholesale discussions, contact partnerships@colorbox.local with a short project brief.',
    },
];

export default function ContactUs() {
    return (
        <StorefrontLayout title="Contact Us">
            <section className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-6 shadow-[var(--cbx-shadow-soft)] lg:p-10">
                <p className="cbx-kicker">Support</p>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:items-end">
                    <div>
                        <h1 className="mt-3 font-heading text-4xl font-black tracking-[-0.04em] text-[var(--cbx-on-surface)] lg:text-6xl">
                            Contact Us
                        </h1>
                        <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] lg:text-base">
                            Questions about products, orders, or account access can be routed through the team that manages the storefront end to end.
                        </p>
                    </div>
                    <div className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)] px-5 py-4 text-sm text-[var(--cbx-on-surface)]">
                        Fastest path: order number + email in your message.
                    </div>
                </div>
            </section>

            <section className="grid gap-px overflow-hidden rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-border-subtle)] lg:grid-cols-3">
                {channels.map((channel) => (
                    <article key={channel.title} className="bg-[var(--cbx-surface-container-lowest)] px-6 py-8 lg:px-7">
                        <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">{channel.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">{channel.content}</p>
                    </article>
                ))}
            </section>
        </StorefrontLayout>
    );
}
