import { Link } from '@inertiajs/react';

const footerSections = [
    {
        title: 'Information',
        items: [
            { type: 'link', label: 'Shop all', href: route('shop.index') },
            { type: 'link', label: 'New arrivals', href: route('collections.show', 'new-arrivals') },
            { type: 'link', label: 'Create account', href: route('register') },
        ],
    },
    {
        title: 'Company',
        items: [
            { type: 'text', label: 'About' },
            { type: 'text', label: 'Location' },
            { type: 'text', label: 'Contact Us' },
            { type: 'text', label: 'Term & Policy' },
        ],
    },
    {
        title: 'Customer Care',
        items: [
            { type: 'link', label: 'Shopping bag', href: route('cart.index') },
            { type: 'link', label: 'Customer access', href: route('login') },
            { type: 'button', label: 'Back to top' },
        ],
    },
    {
        title: 'Multi-brand Links',
        items: [
            { type: 'text', label: 'Executive' },
            { type: 'text', label: 'Lee' },
            { type: 'text', label: 'Wrangler' },
        ],
    },
];

export default function StorefrontFooter() {
    const itemClassName = 'block hover:text-[var(--cbx-secondary)]';

    return (
        <footer className="bg-[var(--cbx-surface-container-lowest)] px-[4%] py-10 text-sm text-[var(--cbx-on-surface-variant)] lg:py-12">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
                <div>
                    <p className="font-heading text-2xl font-black tracking-[-0.03em] text-[var(--cbx-on-surface)]">COLORBOX</p>
                    <p className="mt-4 max-w-xs leading-6">Tailored layers, fluid bottoms, and accessories designed for the office-to-evening switch.</p>
                </div>

                {footerSections.map((section) => (
                    <div key={section.title}>
                        <p className="cbx-kicker">{section.title}</p>
                        <div className="mt-4 space-y-3">
                            {section.items.map((item) => {
                                if (item.type === 'link') {
                                    return (
                                        <Link key={item.label} href={item.href} className={itemClassName}>
                                            {item.label}
                                        </Link>
                                    );
                                }

                                if (item.type === 'button') {
                                    return (
                                        <button
                                            key={item.label}
                                            type="button"
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className={`${itemClassName} text-left`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                }

                                return (
                                    <div key={item.label} className={itemClassName}>
                                        {item.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </footer>
    );
}
