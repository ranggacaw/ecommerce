import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { CreditCard, LockKeyhole, Scale, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

const securityIcons = {
    LockKeyhole,
    CreditCard,
    ShieldCheck,
};

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

export default function TermsPolicy({ termsContent, privacyContent }) {
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
            <section className="border-b border-[var(--cbx-border-subtle)] pb-10">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_16rem] xl:items-end">
                    <div>
                        <p className="cbx-kicker">{termsContent.page_intro.kicker}</p>
                        <h1 className="mt-3 font-heading text-4xl font-black tracking-[-0.04em] text-[var(--cbx-on-surface)] sm:text-5xl lg:text-6xl">
                            {termsContent.page_intro.title}
                        </h1>
                        <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] lg:text-lg lg:leading-8">
                            {termsContent.page_intro.description}
                        </p>
                    </div>

                    <div className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)] p-5 sm:p-6">
                        <p className="cbx-kicker">{termsContent.last_updated_label}</p>
                        <p className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                            {termsContent.last_updated}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">
                            {termsContent.page_summary}
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
                        <span>{termsContent.tab_labels.terms}</span>
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
                        <span>{termsContent.tab_labels.privacy}</span>
                    </button>
                </div>
            </section>

            <div className="mx-auto w-full space-y-16">
                <article id="terms-of-service" role="tabpanel" hidden={activeTab !== 'terms'} className="scroll-mt-32 space-y-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--cbx-brand-light-pink)] text-[var(--cbx-primary)]">
                            <Scale className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="cbx-kicker">{termsContent.section_kicker}</p>
                            <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-4xl">
                                {termsContent.section_title}
                            </h2>
                        </div>
                    </div>

                    <div className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-6 sm:p-8 lg:p-10">
                        <p className="text-xs italic leading-6 text-[var(--cbx-on-surface-variant)]">{termsContent.last_updated_label}: {termsContent.last_updated}</p>

                        <div className="mt-8 space-y-10">
                            {termsContent.sections.map((section, index) => (
                                <section key={section.title} className="border-t border-[var(--cbx-border-subtle)] pt-10 first:border-t-0 first:pt-0">
                                    <h3 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">
                                        {index + 1}. {section.title}
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 text-[var(--cbx-on-surface-variant)] sm:text-base sm:leading-8">
                                        {section.content}
                                    </p>

                                    {section.points.length > 0 ? (
                                        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-[var(--cbx-on-surface-variant)] marker:font-semibold marker:text-[var(--cbx-on-surface)] sm:text-base sm:leading-8">
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

                {activeTab === 'terms' ? <div className="h-px bg-[var(--cbx-border-subtle)]" /> : null}

                <article id="privacy-policy" role="tabpanel" hidden={activeTab !== 'privacy'} className="scroll-mt-32 space-y-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--cbx-border-subtle)] bg-[var(--cbx-secondary-fixed)] text-[var(--cbx-accent-forest)]">
                            <ShieldCheck className="h-5 w-5 stroke-[2.25]" />
                        </span>
                        <div>
                            <p className="cbx-kicker">{privacyContent.section_kicker}</p>
                            <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-4xl">
                                {privacyContent.section_title}
                            </h2>
                        </div>
                    </div>

                    <div className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-6 sm:p-8 lg:p-10">
                        <p className="text-xs italic leading-6 text-[var(--cbx-on-surface-variant)]">{termsContent.last_updated_label}: {termsContent.last_updated}</p>

                        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
                            <div className="space-y-10">
                                {privacyContent.sections.map((section) => (
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
                                    {privacyContent.security_title}
                                </h3>

                                <div className="mt-6 space-y-6">
                                    {privacyContent.security_standards.map(({ icon, title, content }) => {
                                        const Icon = securityIcons[icon] || ShieldCheck;

                                        return (
                                            <div key={title} className="flex items-start gap-4">
                                                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--cbx-surface-container-lowest)] text-[var(--cbx-primary)]">
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <div>
                                                    <p className="cbx-kicker text-[var(--cbx-on-surface)]">{title}</p>
                                                    <p className="mt-2 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">{content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </aside>
                        </div>

                        <section className="mt-10 border-t border-[var(--cbx-border-subtle)] pt-10">
                            <h3 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)] sm:text-3xl">
                                {privacyContent.usage_title}
                            </h3>
                            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] sm:text-base sm:leading-8">
                                {privacyContent.usage_description}
                            </p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                {privacyContent.usage_highlights.map((item) => (
                                    <div key={item.title} className={`border-l-4 ${item.accent_class} py-2 pl-4`}>
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
