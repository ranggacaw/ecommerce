import StorefrontLayout from '@/Layouts/StorefrontLayout';

const policySections = [
    {
        title: 'Orders and payments',
        content: 'Submitted orders are processed after payment confirmation. Availability, fulfillment timing, and shipping updates are communicated through the order flow.',
    },
    {
        title: 'Returns and exchanges',
        content: 'Eligible return or exchange requests should be initiated within the stated return window and must include items in their original condition.',
    },
    {
        title: 'Privacy and account data',
        content: 'Customer information is used to manage orders, account access, and service communication. Data handling should remain limited to operational needs.',
    },
];

export default function TermsPolicy() {
    return (
        <StorefrontLayout title="Terms & Policy">
            <section className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-6 shadow-[var(--cbx-shadow-soft)] lg:p-10">
                <p className="cbx-kicker">Important Information</p>
                <h1 className="mt-3 font-heading text-4xl font-black tracking-[-0.04em] text-[var(--cbx-on-surface)] lg:text-6xl">
                    Terms & Policy
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] lg:text-base">
                    These guidelines explain the baseline expectations for ordering, account usage, and data handling across the Colorbox storefront.
                </p>
            </section>

            <section className="grid gap-4 lg:grid-cols-3 lg:gap-6">
                {policySections.map((section) => (
                    <article key={section.title} className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] px-6 py-8 shadow-[var(--cbx-shadow-soft)]">
                        <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">{section.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">{section.content}</p>
                    </article>
                ))}
            </section>
        </StorefrontLayout>
    );
}
