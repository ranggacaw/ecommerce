import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Link } from '@inertiajs/react';

export default function AccountLayout({ title, categories = [], children }) {
    const tabs = [
        { href: route('dashboard'), label: 'Overview' },
        { href: route('account.addresses'), label: 'Addresses' },
        { href: route('account.wishlist'), label: 'Wishlist' },
        { href: route('profile.edit'), label: 'Profile' },
    ];

    return (
        <StorefrontLayout title={title} categories={categories}>
            <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                    {tabs.map((tab) => (
                        <Link key={tab.href} href={tab.href} className="cbx-button cbx-button-secondary px-4 py-2 text-sm">
                            {tab.label}
                        </Link>
                    ))}
                </div>
                {children}
            </div>
        </StorefrontLayout>
    );
}
