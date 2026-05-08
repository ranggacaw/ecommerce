import StorefrontLayout from '@/Layouts/StorefrontLayout';

const timeline = [
    { year: '1993', title: 'The Genesis', desc: 'COLORBOX opens its first store, dedicated to the teenage spirit and vibrant self-expression.' },
    { year: '2010', title: 'Going Digital', desc: 'We expanded our reach online, becoming the go-to destination for the digital-native generation across the archipelago.', featured: true },
    { year: '2024', title: 'Global Vision', desc: 'Leading the charge in sustainable fashion and innovative retail experiences for the future.' },
];

const values = [
    { icon: 'bolt', label: 'SPEED', desc: 'We move as fast as the youth culture we represent.', color: 'text-[var(--cbx-secondary)]' },
    { icon: 'diversity_3', label: 'INCLUSIVITY', desc: 'Fashion for every body, every style, every individual.', color: 'text-[var(--cbx-accent-forest)]' },
    { icon: 'auto_awesome', label: 'CREATIVITY', desc: 'Always pushing the boundaries of conventional design.', color: 'text-[var(--cbx-brand-pink)]' },
    { icon: 'verified', label: 'QUALITY', desc: 'Accessible trend-setting without compromising on craft.', color: 'text-[var(--cbx-accent-gold)]' },
];

const Icon = ({ name, className }) => {
    const icons = {
        bolt: (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
            </svg>
        ),
        diversity_3: (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 4.5c1.5 0 3 .5 4 1.5 1 1 1.5 2.5 1.5 4 0 1.5-.5 3-1.5 4-1 1-2.5 1.5-4 1.5s-3-.5-4-1.5c-1-1-1.5-2.5-1.5-4 0-1.5.5-3 1.5-4 1-1 2.5-1.5 4-1.5zm-7 3c1.5 0 3 .5 4 1.5 1 1 1.5 2.5 1.5 4 0 1.5-.5 3-1.5 4-1 1-2.5 1.5-4 1.5s-3-.5-4-1.5C1 14.5.5 13 .5 11.5.5 10 1 8.5 2 7.5c1-1 2.5-1.5 4-1.5zm14 0c1.5 0 3 .5 4 1.5 1 1 1.5 2.5 1.5 4 0 1.5-.5 3-1.5 4-1 1-2.5 1.5-4 1.5-1.5 0-3-.5-4-1.5-1-1-1.5-2.5-1.5-4 0-1.5.5-3 1.5-4 1-1 2.5-1.5 4-1.5zm-7 5c-2 0-4 1-4 3v2h8v-2c0-2-2-3-4-3z"/>
            </svg>
        ),
        auto_awesome: (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
            </svg>
        ),
        verified: (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"/>
            </svg>
        ),
    };
    return icons[name] || null;
};

export default function About() {
    return (
        <StorefrontLayout title="About Colorbox">
            {/* Hero Section */}
            <section className="relative h-[500px] md:h-[600px] lg:h-[819px] w-full overflow-hidden bg-[var(--cbx-primary)]">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&q=80" 
                        alt="Editorial fashion" 
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
                    <span className="cbx-kicker text-white mb-4 tracking-[0.2em]">SINCE 1993</span>
                    <h1 className="font-heading text-5xl md:text-7xl lg:text-[96px] text-white leading-none uppercase mb-6">
                        Define<br/>Your<br/><span className="text-[var(--cbx-secondary)]">Self.</span>
                    </h1>
                    <p className="font-sans text-lg md:text-xl text-white max-w-lg opacity-90">
                        Empowering the youth generation to express their unique identity through fast-paced, high-impact street style.
                    </p>
                </div>
            </section>

            {/* Brand Mission Section */}
            <section className="py-10 md:py-16 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 md:gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--cbx-primary)] uppercase border-l-4 border-[var(--cbx-secondary)] pl-6">
                            The Mission
                        </h2>
                        <p className="font-sans text-lg md:text-xl text-[var(--cbx-on-surface-variant)]">
                            At COLORBOX, we don't just follow trends; we ignite them. Our mission is to provide a platform for self-expression, offering the latest global styles at the speed of youth culture.
                        </p>
                        <div className="bg-[var(--cbx-surface-container-low)] p-8 rounded-lg border border-[var(--cbx-border-subtle)]">
                            <p className="font-heading text-2xl italic text-[var(--cbx-primary)]">
                                "Style is a way to say who you are without having to speak."
                            </p>
                        </div>
                    </div>
                    <div className="relative h-[350px] md:h-[500px]">
                        <img 
                            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" 
                            alt="Fashion studio" 
                            className="w-full h-full object-cover rounded-xl shadow-[var(--cbx-shadow-soft)]"
                        />
                    </div>
                </div>
            </section>

            {/* History Timeline Section */}
            <section className="bg-[var(--cbx-surface-alt)] py-10 md:py-16">
                <div className="px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-[var(--cbx-primary)]">OUR JOURNEY</h2>
                        <span className="cbx-kicker text-[var(--cbx-secondary)]">A LEGACY OF STYLE</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {timeline.map((item) => (
                            <div 
                                key={item.year}
                                className={`p-8 md:p-10 flex flex-col justify-between h-[280px] md:h-[320px] border transition-colors hover:border-[var(--cbx-secondary)] ${
                                    item.featured 
                                        ? 'bg-[var(--cbx-primary)] text-white' 
                                        : 'bg-[var(--cbx-surface-container-lowest)] border-[var(--cbx-border-subtle)]'
                                }`}
                            >
                                <span className={`font-heading text-5xl md:text-[60px] ${item.featured ? 'text-[var(--cbx-neutral-mid)]' : 'text-[var(--cbx-surface-container-highest)] group-hover:text-[var(--cbx-secondary)]'}`}>
                                    {item.year}
                                </span>
                                <div>
                                    <h3 className={`font-heading text-xl md:text-2xl font-semibold mb-2 ${item.featured ? 'text-white' : 'text-[var(--cbx-on-surface)]'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`font-sans text-sm ${item.featured ? 'text-white opacity-80' : 'text-[var(--cbx-on-surface-variant)]'}`}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-10 md:py-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--cbx-primary)] uppercase mb-12 md:mb-16 tracking-tight">
                    Our Core Values
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {values.map((value) => (
                        <div key={value.label} className="space-y-4 flex flex-col items-center">
                            <div className="w-16 h-16 bg-[var(--cbx-surface-container-high)] rounded-full flex items-center justify-center">
                                <Icon name={value.icon} className={value.color} />
                            </div>
                            <h3 className="cbx-kicker">{value.label}</h3>
                            <p className="font-sans text-sm text-[var(--cbx-on-surface-variant)]">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative w-full h-[400px] md:h-[600px] mt-10 md:mt-16">
                <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80" 
                    alt="Retail store" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[var(--cbx-primary)]/40 flex flex-col items-center justify-center text-center px-6">
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 md:mb-8">
                        Ready to define your style?
                    </h2>
                    <a 
                        href="/shop" 
                        className="bg-white text-[var(--cbx-primary)] px-8 md:px-12 py-4 cbx-kicker hover:bg-[var(--cbx-secondary)] hover:text-white transition-all duration-300"
                    >
                        SHOP THE COLLECTION
                    </a>
                </div>
            </section>
        </StorefrontLayout>
    );
}
