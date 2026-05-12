# Change: Expand storefront content into the admin CMS

## Why
Large parts of the customer-facing storefront still rely on hard-coded copy and section arrays outside the homepage. Staff can already manage banners and homepage merchandising copy, but they still need a code change to update shared shell content and the About, Contact, and legal pages.

## What Changes
- Extend the existing admin merchandising workflow so staff can manage shared storefront shell content in addition to homepage sections.
- Add CMS-backed content records for About, Contact Us, Terms of Service, Privacy Policy, and reusable layout/footer utility content while keeping URL-based media and server-side validation.
- Seed the new editable records from the current hard-coded storefront copy so the public experience stays stable during rollout.

## Impact
- Affected specs: `admin-cms`, `catalog-administration`, `storefront-content`
- Affected code: `app/Http/Controllers/Admin/CatalogController.php`, `app/Http/Controllers/StorefrontController.php`, `app/Http/Controllers/StorefrontPageController.php`, `app/Models/HomepageContent.php` or successor content model(s), `resources/js/Pages/Admin/Merchandising.jsx`, `resources/js/Layouts/StorefrontLayout.jsx`, `resources/js/Components/Storefront/StorefrontFooter.jsx`, `resources/js/Pages/Storefront/About.jsx`, `resources/js/Pages/Storefront/ContactUs.jsx`, `resources/js/Pages/Storefront/TermsPolicy.jsx`, related migrations, routes, and feature tests
