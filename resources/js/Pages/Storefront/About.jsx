import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Link } from '@inertiajs/react';

const Icon = ({ name, className }) => {
    const icons = {
        bolt: (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path d="M7 2v11h3v9l7-12h-4l4-8z" />
            </svg>
        ),
        diversity_3: (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 4.5c1.5 0 3 .5 4 1.5 1 1 1.5 2.5 1.5 4 0 1.5-.5 3-1.5 4-1 1-2.5 1.5-4 1.5s-3-.5-4-1.5c-1-1-1.5-2.5-1.5-4 0-1.5.5-3 1.5-4 1-1 2.5-1.5 4-1.5zm-7 3c1.5 0 3 .5 4 1.5 1 1 1.5 2.5 1.5 4 0 1.5-.5 3-1.5 4-1 1-2.5 1.5-4 1.5s-3-.5-4-1.5C1 14.5.5 13 .5 11.5.5 10 1 8.5 2 7.5c1-1 2.5-1.5 4-1.5zm14 0c1.5 0 3 .5 4 1.5 1 1 1.5 2.5 1.5 4 0 1.5-.5 3-1.5 4-1 1-2.5 1.5-4 1.5-1.5 0-3-.5-4-1.5-1-1-1.5-2.5-1.5-4 0-1.5.5-3 1.5-4 1-1 2.5-1.5 4-1.5zm-7 5c-2 0-4 1-4 3v2h8v-2c0-2-2-3-4-3z" />
            </svg>
        ),
        auto_awesome: (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
            </svg>
        ),
        verified: (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z" />
            </svg>
        ),
    };

    return icons[name] || null;
};

export default function About({ aboutContent }) {
    return (
        <StorefrontLayout title="About Colorbox">
            <section className="relative h-[500px] w-full overflow-hidden bg-[var(--cbx-primary)] md:h-[600px] lg:h-[819px]">
                <div className="absolute inset-0">
                    <img src={aboutContent.hero.image_url} alt={aboutContent.hero.image_alt} className="h-full w-full object-cover opacity-80" />
                </div>
                <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 md:px-12">
                    <span className="cbx-kicker mb-4 text-white tracking-[0.2em]">{aboutContent.hero.kicker}</span>
                    <h1 className="mb-6 font-heading text-5xl leading-none text-white md:text-7xl lg:text-[96px]">
                        {aboutContent.hero.title.split('\n').map((line) => (
                            <span key={line} className="block uppercase">{line}</span>
                        ))}
                        <span className="block uppercase text-[var(--cbx-secondary)]">{aboutContent.hero.highlight}</span>
                    </h1>
                    <p className="max-w-lg font-sans text-lg text-white opacity-90 md:text-xl">{aboutContent.hero.description}</p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1.5fr] md:gap-12">
                    <div className="space-y-6">
                        <h2 className="border-l-4 border-[var(--cbx-secondary)] pl-6 font-heading text-3xl font-bold uppercase text-[var(--cbx-primary)] md:text-4xl">
                            {aboutContent.mission.title}
                        </h2>
                        <p className="font-sans text-lg text-[var(--cbx-on-surface-variant)] md:text-xl">{aboutContent.mission.description}</p>
                        <div className="rounded-lg border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-low)] p-8">
                            <p className="font-heading text-2xl italic text-[var(--cbx-primary)]">{aboutContent.mission.quote}</p>
                        </div>
                    </div>
                    <div className="relative h-[350px] md:h-[500px]">
                        <img src={aboutContent.mission.image_url} alt={aboutContent.mission.image_alt} className="h-full w-full rounded-xl object-cover shadow-[var(--cbx-shadow-soft)]" />
                    </div>
                </div>
            </section>

            <section className="bg-[var(--cbx-surface-alt)] py-10 md:py-16">
                <div className="mx-auto max-w-7xl px-6 md:px-12">
                    <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
                        <h2 className="font-heading text-4xl font-bold text-[var(--cbx-primary)] md:text-5xl">{aboutContent.timeline.title}</h2>
                        <span className="cbx-kicker text-[var(--cbx-secondary)]">{aboutContent.timeline.kicker}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                        {aboutContent.timeline.items.map((item) => (
                            <div
                                key={`${item.year}-${item.title}`}
                                className={`flex h-[280px] flex-col justify-between border p-8 transition-colors hover:border-[var(--cbx-secondary)] md:h-[320px] md:p-10 ${
                                    item.featured
                                        ? 'bg-[var(--cbx-primary)] text-white'
                                        : 'border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)]'
                                }`}
                            >
                                <span className={`font-heading text-5xl md:text-[60px] ${item.featured ? 'text-[var(--cbx-neutral-mid)]' : 'text-[var(--cbx-surface-container-highest)]'}`}>
                                    {item.year}
                                </span>
                                <div>
                                    <h3 className={`mb-2 font-heading text-xl font-semibold md:text-2xl ${item.featured ? 'text-white' : 'text-[var(--cbx-on-surface)]'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`font-sans text-sm ${item.featured ? 'text-white opacity-80' : 'text-[var(--cbx-on-surface-variant)]'}`}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-10 text-center md:px-12 md:py-16">
                <h2 className="mb-12 font-heading text-3xl font-bold tracking-tight text-[var(--cbx-primary)] md:mb-16 md:text-4xl">
                    {aboutContent.values.title}
                </h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-12">
                    {aboutContent.values.items.map((value) => (
                        <div key={value.label} className="flex flex-col items-center space-y-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cbx-surface-container-high)]">
                                <Icon name={value.icon} className={value.color} />
                            </div>
                            <h3 className="cbx-kicker">{value.label}</h3>
                            <p className="font-sans text-sm text-[var(--cbx-on-surface-variant)]">{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="relative mt-10 h-[400px] w-full md:mt-16 md:h-[600px]">
                <img src={aboutContent.cta.image_url} alt={aboutContent.cta.image_alt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--cbx-primary)]/40 px-6 text-center">
                    <h2 className="mb-6 font-heading text-4xl text-white md:mb-8 md:text-5xl lg:text-6xl">{aboutContent.cta.title}</h2>
                    <Link href={aboutContent.cta.button_href} className="bg-white px-8 py-4 text-[var(--cbx-primary)] transition-all duration-300 hover:bg-[var(--cbx-secondary)] hover:text-white md:px-12 cbx-kicker">
                        {aboutContent.cta.button_label}
                    </Link>
                </div>
            </section>
        </StorefrontLayout>
    );
}
