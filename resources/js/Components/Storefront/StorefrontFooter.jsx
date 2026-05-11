import { Link } from '@inertiajs/react';

const defaultContent = {
    brand_description: 'Tailored layers, fluid bottoms, and accessories designed for the office-to-evening switch.',
    information_title: 'Information',
    shop_all_label: 'Shop all',
    new_arrivals_label: 'New arrivals',
    create_account_label: 'Create account',
    company_title: 'Company',
    about_label: 'About',
    location_label: 'Location',
    contact_label: 'Contact Us',
    terms_label: 'Term & Policy',
    customer_care_title: 'Customer Care',
    shopping_bag_label: 'Shopping bag',
    customer_access_label: 'Customer access',
    back_to_top_label: 'Back to top',
    multi_brand_title: 'Multi-brand Links',
    multi_brand_labels: ['Executive', 'Lee', 'Wrangler'],
};

export default function StorefrontFooter({ content = defaultContent }) {
    const itemClassName = 'block hover:text-[var(--cbx-secondary)]';
    const footerContent = content?.brand_description ? content : defaultContent;
    const footerSections = [
        {
            title: footerContent.information_title,
            items: [
                { type: 'link', label: footerContent.shop_all_label, href: route('shop.index') },
                { type: 'link', label: footerContent.new_arrivals_label, href: route('collections.show', 'new-arrivals') },
                { type: 'link', label: footerContent.create_account_label, href: route('register') },
            ],
        },
        {
            title: footerContent.company_title,
            items: [
                { type: 'link', label: footerContent.about_label, href: route('storefront.about') },
                { type: 'link', label: footerContent.location_label, href: route('storefront.location') },
                { type: 'link', label: footerContent.contact_label, href: route('storefront.contact') },
                { type: 'link', label: footerContent.terms_label, href: route('storefront.terms') },
            ],
        },
        {
            title: footerContent.customer_care_title,
            items: [
                { type: 'link', label: footerContent.shopping_bag_label, href: route('cart.index') },
                { type: 'link', label: footerContent.customer_access_label, href: route('login') },
                { type: 'button', label: footerContent.back_to_top_label },
            ],
        },
        {
            title: footerContent.multi_brand_title,
            items: footerContent.multi_brand_labels.map((label) => ({ type: 'text', label })),
        },
    ];

    return (
        <footer className="bg-[var(--cbx-surface-container-lowest)] px-[4%] py-10 text-sm text-[var(--cbx-on-surface-variant)] lg:py-12">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
                <div>
                    <p className="font-heading text-2xl font-black tracking-[-0.03em] text-[var(--cbx-on-surface)]">COLORBOX</p>
                    <p className="mt-4 max-w-xs leading-6">{footerContent.brand_description}</p>
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
