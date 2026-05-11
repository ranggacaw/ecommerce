## 1. Persistence
- [x] 1.1 Add a dedicated homepage content persistence model and schema for homepage-only copy, labels, links, and support-card content.
- [x] 1.2 Seed the initial homepage content values from the current hard-coded `resources/js/Pages/Storefront/Home.jsx` copy so rollout keeps the existing storefront presentation.

## 2. Admin Merchandising
- [x] 2.1 Load homepage content into the existing admin merchandising controller and page without adding a new top-level admin section.
- [x] 2.2 Add section-based homepage forms in `resources/js/Pages/Admin/Merchandising.jsx` for hero CTA metadata, support cards, flash-sale messaging, category discovery copy, new-arrivals copy, editorial/social content, and featured-products section copy.
- [x] 2.3 Implement server-side validation and redirect-back submissions for homepage content updates, matching the current admin CMS pattern.

## 3. Storefront Rendering
- [x] 3.1 Update `app/Http/Controllers/StorefrontController.php` to load homepage content with existing banners, categories, collections, and featured products.
- [x] 3.2 Update `resources/js/Pages/Storefront/Home.jsx` to render CMS-managed homepage copy and links while keeping category, collection, and featured-product data driven by existing models.

## 4. Validation
- [x] 4.1 Add feature coverage for admin homepage-content updates and storefront homepage rendering with saved content.
- [x] 4.2 Run `php artisan test` (blocked in this environment because the configured in-memory SQLite driver is missing: `could not find driver`).
- [x] 4.3 Run `npm run build`.
