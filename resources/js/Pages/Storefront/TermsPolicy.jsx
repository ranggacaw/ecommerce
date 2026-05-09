import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { CreditCard, LockKeyhole, Scale, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

const lastUpdated = 'October 24, 2023';

const termsSections = [
    {
        title: 'Acceptance of terms',
        content:
            "By accessing and using the Colorbox website, products, and services, you agree to be bound by these terms, our policies, and applicable laws. If you do not agree with them, you should not use the storefront.",
    },
    {
        title: 'Use license',
        content:
            "Permission is granted to temporarily access one copy of the materials on Colorbox for personal, non-commercial viewing only. This is a limited license, not a transfer of title.",
        points: [
            'Modify or copy the materials beyond standard personal use.',
            'Use the materials for commercial purposes or public display without written permission.',
            'Attempt to decompile or reverse engineer software contained on the site.',
            'Remove copyright, trademark, or other proprietary notices from the materials.',
            'Mirror or redistribute the materials on another server or platform.',
        ],
    },
    {
        title: 'Disclaimer',
        content:
            "All storefront materials are provided on an 'as is' basis. Colorbox makes no express or implied warranties, including merchantability, fitness for a particular purpose, or non-infringement, unless required by applicable law.",
    },
];

const privacySections = [
    {
        title: 'Data collection',
        content:
            'We collect information when you create an account, place an order, subscribe to updates, or contact support. Depending on the flow, this may include your name, email address, shipping details, phone number, and order information.',
    },
    {
        title: 'Cookies usage',
        content:
            'Cookies help us remember cart contents, save browsing preferences, and understand site usage patterns so the storefront experience stays faster and more relevant across visits.',
    },
];

const securityStandards = [
    {
        title: 'SSL encryption',
        content: 'Sensitive information is transmitted through secure encrypted connections during checkout and account activity.',
        Icon: LockKeyhole,
    },
    {
        title: 'PCI-aware handling',
        content: 'Transaction data is retained only as long as needed to complete the purchase and support operational follow-up.',
        Icon: CreditCard,
    },
    {
        title: 'Privacy-first access',
        content: 'Customer data handling stays limited to order management, account access, and service communication needs.',
        Icon: ShieldCheck,
    },
];

const dataUsageHighlights = [
    {
        title: 'Personalize',
        content: 'To better respond to your preferences, account activity, and purchase history.',
        accentClass: 'border-[var(--cbx-primary)]',
    },
    {
        title: 'Improve',
        content: 'To refine the storefront experience, services, and support flow based on real usage patterns.',
        accentClass: 'border-[var(--cbx-secondary)]',
    },
    {
        title: 'Service',
        content: 'To process transactions, send order updates, and handle operational communication.',
        accentClass: 'border-[var(--cbx-accent-forest)]',
    },
];

const legalTabs = {
    terms: 'terms-of-service',
    privacy: 'privacy-policy',
};

function getActiveTabFromHash() {
    if (typeof window === 'undefined') {
        return 'terms';
    }

    return window.location.hash === `#${legalTabs.privacy}` ? 'privacy' : 'terms';
}

export default function TermsPolicy() {
    const [activeTab, setActiveTab] = useState(getActiveTabFromHash);

    useEffect(() => {
        const syncTabFromHash = () => setActiveTab(getActiveTabFromHash());

        syncTabFromHash();
        window.addEventListener('hashchange', syncTabFromHash);

        return () => window.removeEventListener('hashchange', syncTabFromHash);
    }, []);

    const selectTab = (tab) => {
        setActiveTab(tab);
        window.history.replaceState(null, '', `#${legalTabs[tab]}`);
    };

    return (
        <StorefrontLayout title="Terms & Policy">
            {/* Section: Legal Intro */}
            <section className="border-b border-[var(--cbx-border-subtle)] pb-10">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_16rem] xl:items-end">
                    <div>
                        <p className="cbx-kicker">Important Information</p>
                        <h1 className="mt-3 font-heading text-4xl font-black tracking-[-0.04em] text-[var(--cbx-on-surface)] sm:text-5xl lg:text-6xl">
                            Legal agreements
                        </h1>
                        <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] lg:text-lg lg:leading-8">
                            Please read our Terms of Service and Privacy Policy carefully. These documents explain the baseline expectations for ordering, account usage, and how customer information is managed across the Colorbox storefront.
                        </p>
                    </div>

                    <div className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)] p-5 sm:p-6">
                        <p className="cbx-kicker">Last updated</p>
                        <p className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                            {lastUpdated}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">
                            A focused reference for service terms, privacy practices, and customer data handling standards.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3" role="tablist" aria-label="Legal document tabs">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'terms'}
                        aria-controls="terms-of-service"
                        onClick={() => selectTab('terms')}
                        className={`cbx-button px-6 py-3 text-xs uppercase tracking-[0.16em] ${
                            activeTab === 'terms' ? 'cbx-button-primary' : 'cbx-button-secondary'
                        }`}
                    >
                        <span>Terms of service</span>
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'privacy'}
                        aria-controls="privacy-policy"
                        onClick={() => selectTab('privacy')}
                        className={`cbx-button px-6 py-3 text-xs uppercase tracking-[0.16em] ${
                            activeTab === 'privacy' ? 'cbx-button-primary' : 'cbx-button-secondary'
                        }`}
                    >
                        <span>Privacy policy</span>
                    </button>
                </div>
            </section>

            {/* Section: Legal Content */}
            <div className="mx-auto w-full space-y-16">
                {/* Section: Terms of Service */}
                <article
                    id="terms-of-service"
                    role="tabpanel"
                    hidden={activeTab !== 'terms'}
                    className="scroll-mt-32 space-y-8"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--cbx-brand-light-pink)] text-[var(--cbx-primary)]">
                            <Scale className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="cbx-kicker">Legal foundation</p>
                            <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-4xl">
                                Terms of Service
                            </h2>
                        </div>
                    </div>

                    <div className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-6 sm:p-8 lg:p-10">
                        <p className="text-xs italic leading-6 text-[var(--cbx-on-surface-variant)]">Last updated: {lastUpdated}</p>

                        <div className="mt-8 space-y-10">
                            {termsSections.map((section, index) => (
                                <section key={section.title} className="border-t border-[var(--cbx-border-subtle)] pt-10 first:border-t-0 first:pt-0">
                                    <h3 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                        {index + 1}. {section.title}
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 text-[var(--cbx-on-surface-variant)] sm:text-base sm:leading-8">
                                        {section.content}
                                    </p>

                                    {section.points ? (
                                        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-[var(--cbx-on-surface-variant)] sm:text-base sm:leading-8 marker:font-semibold marker:text-[var(--cbx-on-surface)]">
                                            {section.points.map((point) => (
                                                <li key={point}>{point}</li>
                                            ))}
                                        </ol>
                                    ) : null}
                                </section>
                            ))}
                        </div>
                    </div>
                </article>

                {/* Section: Visual Divider */}
                {activeTab === 'terms' ? <div className="h-px bg-[var(--cbx-border-subtle)]" /> : null}

                {/* Section: Privacy Policy */}
                <article
                    id="privacy-policy"
                    role="tabpanel"
                    hidden={activeTab !== 'privacy'}
                    className="scroll-mt-32 space-y-8"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--cbx-border-subtle)] bg-[var(--cbx-secondary-fixed)] text-[var(--cbx-accent-forest)]">
                            <ShieldCheck className="h-5 w-5 stroke-[2.25]" />
                        </span>
                        <div>
                            <p className="cbx-kicker">Customer data</p>
                            <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-4xl">
                                Privacy Policy
                            </h2>
                        </div>
                    </div>

                    <div className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-6 sm:p-8 lg:p-10">
                        <p className="text-xs italic leading-6 text-[var(--cbx-on-surface-variant)]">Last updated: {lastUpdated}</p>

                        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
                            <div className="space-y-10">
                                {privacySections.map((section) => (
                                    <section key={section.title} className="border-t border-[var(--cbx-border-subtle)] pt-10 first:border-t-0 first:pt-0">
                                        <h3 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                            {section.title}
                                        </h3>
                                        <p className="mt-4 text-sm leading-7 text-[var(--cbx-on-surface-variant)] sm:text-base sm:leading-8">
                                            {section.content}
                                        </p>
                                    </section>
                                ))}
                            </div>

                            <aside className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)] p-6 sm:p-8">
                                <h3 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                    Security standards
                                </h3>

                                <div className="mt-6 space-y-6">
                                    {securityStandards.map(({ title, content, Icon }) => (
                                        <div key={title} className="flex items-start gap-4">
                                            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--cbx-surface-container-lowest)] text-[var(--cbx-primary)]">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <p className="cbx-kicker text-[var(--cbx-on-surface)]">{title}</p>
                                                <p className="mt-2 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">{content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </aside>
                        </div>

                        <section className="mt-10 border-t border-[var(--cbx-border-subtle)] pt-10">
                            <h3 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-3xl">
                                How we use your information
                            </h3>
                            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] sm:text-base sm:leading-8">
                                Any information we collect may be used to support better service, a smoother storefront experience, and clearer communication throughout the purchase journey.
                            </p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                {dataUsageHighlights.map((item) => (
                                    <div key={item.title} className={`border-l-4 ${item.accentClass} pl-4 py-2`}>
                                        <p className="font-heading text-xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                            {item.title}
                                        </p>
                                        <p className="mt-2 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">
                                            {item.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </article>
            </div>
        </StorefrontLayout>
    );
}
