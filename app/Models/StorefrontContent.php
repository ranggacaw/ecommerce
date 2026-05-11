<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StorefrontContent extends Model
{
    use HasFactory;

    public const SHELL = 'shell';
    public const ABOUT = 'about';
    public const CONTACT = 'contact';
    public const TERMS = 'terms';
    public const PRIVACY = 'privacy';

    protected $fillable = [
        'key',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public static function current(string $key): self
    {
        $defaults = self::defaults();

        return self::query()->firstOrCreate(
            ['key' => $key],
            ['content' => $defaults[$key] ?? []],
        );
    }

    public static function content(string $key): array
    {
        $defaults = self::defaults();

        return self::current($key)->content ?? ($defaults[$key] ?? []);
    }

    public static function currentMap(): array
    {
        $content = [];

        foreach (array_keys(self::defaults()) as $key) {
            $content[$key] = self::content($key);
        }

        return $content;
    }

    public static function defaults(): array
    {
        return [
            self::SHELL => self::shellDefaults(),
            self::ABOUT => self::aboutDefaults(),
            self::CONTACT => self::contactDefaults(),
            self::TERMS => self::termsDefaults(),
            self::PRIVACY => self::privacyDefaults(),
        ];
    }

    protected static function shellDefaults(): array
    {
        return [
            'utility_labels' => ['Executive', 'et cetera', 'Wrangler'],
            'order_tracking' => [
                'kicker' => 'Track Order',
                'title' => 'Quick order utility',
                'description' => 'Support tools stay accessible, but the presentation is quieter and cleaner.',
                'input_placeholder' => 'Order ID',
                'button_label' => 'Track',
            ],
            'account_cta' => [
                'kicker' => 'Join the Box',
                'title' => 'Create your account',
                'description' => 'Save favorites, review orders, and move through checkout faster.',
                'guest_primary_label' => 'Create account',
                'guest_secondary_label' => 'Sign in',
                'member_primary_label' => 'Open account',
            ],
            'footer' => [
                'brand_description' => 'Tailored layers, fluid bottoms, and accessories designed for the office-to-evening switch.',
                'information_title' => 'Information',
                'shop_all_label' => 'Shop all',
                'new_arrivals_label' => 'New arrivals',
                'create_account_label' => 'Create account',
                'company_title' => 'Company',
                'about_label' => 'About',
                'location_label' => 'Location',
                'contact_label' => 'Contact Us',
                'terms_label' => 'Term & Policy',
                'customer_care_title' => 'Customer Care',
                'shopping_bag_label' => 'Shopping bag',
                'customer_access_label' => 'Customer access',
                'back_to_top_label' => 'Back to top',
                'multi_brand_title' => 'Multi-brand Links',
                'multi_brand_labels' => ['Executive', 'Lee', 'Wrangler'],
            ],
        ];
    }

    protected static function aboutDefaults(): array
    {
        return [
            'hero' => [
                'kicker' => 'SINCE 1993',
                'title' => "Define\nYour",
                'highlight' => 'Self.',
                'description' => 'Empowering the youth generation to express their unique identity through fast-paced, high-impact street style.',
                'image_url' => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&q=80',
                'image_alt' => 'Editorial fashion',
            ],
            'mission' => [
                'title' => 'The Mission',
                'description' => "At COLORBOX, we don't just follow trends; we ignite them. Our mission is to provide a platform for self-expression, offering the latest global styles at the speed of youth culture.",
                'quote' => '"Style is a way to say who you are without having to speak."',
                'image_url' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
                'image_alt' => 'Fashion studio',
            ],
            'timeline' => [
                'title' => 'OUR JOURNEY',
                'kicker' => 'A LEGACY OF STYLE',
                'items' => [
                    [
                        'year' => '1993',
                        'title' => 'The Genesis',
                        'description' => 'COLORBOX opens its first store, dedicated to the teenage spirit and vibrant self-expression.',
                        'featured' => false,
                    ],
                    [
                        'year' => '2010',
                        'title' => 'Going Digital',
                        'description' => 'We expanded our reach online, becoming the go-to destination for the digital-native generation across the archipelago.',
                        'featured' => true,
                    ],
                    [
                        'year' => '2024',
                        'title' => 'Global Vision',
                        'description' => 'Leading the charge in sustainable fashion and innovative retail experiences for the future.',
                        'featured' => false,
                    ],
                ],
            ],
            'values' => [
                'title' => 'Our Core Values',
                'items' => [
                    [
                        'icon' => 'bolt',
                        'label' => 'SPEED',
                        'description' => 'We move as fast as the youth culture we represent.',
                        'color' => 'text-[var(--cbx-secondary)]',
                    ],
                    [
                        'icon' => 'diversity_3',
                        'label' => 'INCLUSIVITY',
                        'description' => 'Fashion for every body, every style, every individual.',
                        'color' => 'text-[var(--cbx-accent-forest)]',
                    ],
                    [
                        'icon' => 'auto_awesome',
                        'label' => 'CREATIVITY',
                        'description' => 'Always pushing the boundaries of conventional design.',
                        'color' => 'text-[var(--cbx-brand-pink)]',
                    ],
                    [
                        'icon' => 'verified',
                        'label' => 'QUALITY',
                        'description' => 'Accessible trend-setting without compromising on craft.',
                        'color' => 'text-[var(--cbx-accent-gold)]',
                    ],
                ],
            ],
            'cta' => [
                'title' => 'Ready to define your style?',
                'button_label' => 'SHOP THE COLLECTION',
                'button_href' => '/shop',
                'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
                'image_alt' => 'Retail store',
            ],
        ];
    }

    protected static function contactDefaults(): array
    {
        return [
            'intro' => [
                'kicker' => 'Support',
                'title' => 'Get in touch',
                'description' => 'Questions about products, orders, account access, or store services can be routed through the customer experience team in one place.',
            ],
            'form' => [
                'kicker' => 'Send a message',
                'title' => 'Customer experience team',
                'description' => 'This form opens your default email app with the message prefilled, so you can send support details with the right structure immediately.',
                'name_label' => 'Name',
                'email_label' => 'Email',
                'topic_label' => 'Topic',
                'topic_placeholder' => 'Select a topic',
                'order_number_label' => 'Order number',
                'message_label' => 'Message',
                'message_placeholder' => 'How can we help you?',
                'submit_note' => 'Need a quicker answer for active orders? WhatsApp is the fastest path during business hours.',
                'submit_button_label' => 'Send message',
                'email_recipient' => 'hello@colorbox.local',
                'topics' => [
                    ['value' => 'order', 'label' => 'Order inquiry'],
                    ['value' => 'return', 'label' => 'Returns and exchanges'],
                    ['value' => 'shipping', 'label' => 'Shipping status'],
                    ['value' => 'product', 'label' => 'Product information'],
                    ['value' => 'partnership', 'label' => 'Partnership inquiry'],
                    ['value' => 'other', 'label' => 'Other'],
                ],
            ],
            'support' => [
                'kicker' => 'Support channels',
                'title' => 'Pick the channel that matches the urgency.',
                'channels' => [
                    [
                        'icon' => 'MessageCircle',
                        'title' => 'WhatsApp support',
                        'value' => '+62 811-1234-5678',
                        'detail' => 'Available Mon-Fri, 9am - 6pm WIB',
                        'href' => 'https://wa.me/6281112345678',
                    ],
                    [
                        'icon' => 'Mail',
                        'title' => 'Email support',
                        'value' => 'hello@colorbox.local',
                        'detail' => 'Best for order updates, returns, and product questions',
                        'href' => 'mailto:hello@colorbox.local',
                    ],
                    [
                        'icon' => 'PhoneCall',
                        'title' => 'Phone line',
                        'value' => '+62 21 5555 0188',
                        'detail' => 'Toll-free support for urgent delivery follow-up',
                        'href' => 'tel:+622155550188',
                    ],
                ],
            ],
            'faq' => [
                'kicker' => 'Need a quick answer?',
                'title' => 'Start with terms, policy, and service basics.',
                'description' => 'For shipping windows, exchange expectations, and account handling, the help content usually answers the first round of questions fast.',
                'button_label' => 'View terms & policy',
            ],
            'visit' => [
                'kicker' => 'Visit in person',
                'title' => 'Prefer face-to-face support?',
                'description' => 'Store teams can help with sizing guidance, pickup questions, and collection availability before you place an order.',
                'button_label' => 'Open store locations',
            ],
        ];
    }

    protected static function termsDefaults(): array
    {
        return [
            'page_intro' => [
                'kicker' => 'Important Information',
                'title' => 'Legal agreements',
                'description' => 'Please read our Terms of Service and Privacy Policy carefully. These documents explain the baseline expectations for ordering, account usage, and how customer information is managed across the Colorbox storefront.',
            ],
            'last_updated' => 'October 24, 2023',
            'last_updated_label' => 'Last updated',
            'page_summary' => 'A focused reference for service terms, privacy practices, and customer data handling standards.',
            'tab_labels' => [
                'terms' => 'Terms of service',
                'privacy' => 'Privacy policy',
            ],
            'section_kicker' => 'Legal foundation',
            'section_title' => 'Terms of Service',
            'sections' => [
                [
                    'title' => 'Acceptance of terms',
                    'content' => 'By accessing and using the Colorbox website, products, and services, you agree to be bound by these terms, our policies, and applicable laws. If you do not agree with them, you should not use the storefront.',
                    'points' => [],
                ],
                [
                    'title' => 'Use license',
                    'content' => 'Permission is granted to temporarily access one copy of the materials on Colorbox for personal, non-commercial viewing only. This is a limited license, not a transfer of title.',
                    'points' => [
                        'Modify or copy the materials beyond standard personal use.',
                        'Use the materials for commercial purposes or public display without written permission.',
                        'Attempt to decompile or reverse engineer software contained on the site.',
                        'Remove copyright, trademark, or other proprietary notices from the materials.',
                        'Mirror or redistribute the materials on another server or platform.',
                    ],
                ],
                [
                    'title' => 'Disclaimer',
                    'content' => "All storefront materials are provided on an 'as is' basis. Colorbox makes no express or implied warranties, including merchantability, fitness for a particular purpose, or non-infringement, unless required by applicable law.",
                    'points' => [],
                ],
            ],
        ];
    }

    protected static function privacyDefaults(): array
    {
        return [
            'section_kicker' => 'Customer data',
            'section_title' => 'Privacy Policy',
            'sections' => [
                [
                    'title' => 'Data collection',
                    'content' => 'We collect information when you create an account, place an order, subscribe to updates, or contact support. Depending on the flow, this may include your name, email address, shipping details, phone number, and order information.',
                ],
                [
                    'title' => 'Cookies usage',
                    'content' => 'Cookies help us remember cart contents, save browsing preferences, and understand site usage patterns so the storefront experience stays faster and more relevant across visits.',
                ],
            ],
            'security_title' => 'Security standards',
            'security_standards' => [
                [
                    'icon' => 'LockKeyhole',
                    'title' => 'SSL encryption',
                    'content' => 'Sensitive information is transmitted through secure encrypted connections during checkout and account activity.',
                ],
                [
                    'icon' => 'CreditCard',
                    'title' => 'PCI-aware handling',
                    'content' => 'Transaction data is retained only as long as needed to complete the purchase and support operational follow-up.',
                ],
                [
                    'icon' => 'ShieldCheck',
                    'title' => 'Privacy-first access',
                    'content' => 'Customer data handling stays limited to order management, account access, and service communication needs.',
                ],
            ],
            'usage_title' => 'How we use your information',
            'usage_description' => 'Any information we collect may be used to support better service, a smoother storefront experience, and clearer communication throughout the purchase journey.',
            'usage_highlights' => [
                [
                    'title' => 'Personalize',
                    'content' => 'To better respond to your preferences, account activity, and purchase history.',
                    'accent_class' => 'border-[var(--cbx-primary)]',
                ],
                [
                    'title' => 'Improve',
                    'content' => 'To refine the storefront experience, services, and support flow based on real usage patterns.',
                    'accent_class' => 'border-[var(--cbx-secondary)]',
                ],
                [
                    'title' => 'Service',
                    'content' => 'To process transactions, send order updates, and handle operational communication.',
                    'accent_class' => 'border-[var(--cbx-accent-forest)]',
                ],
            ],
        ];
    }
}
