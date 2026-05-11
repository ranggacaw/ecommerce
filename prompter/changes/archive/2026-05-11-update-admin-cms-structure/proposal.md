# Change: Expand the built-in admin area into a structured CMS

## Why
The storefront application already includes partial admin routes, role checks, and content-backed models, but the current back office is concentrated in a single dashboard and does not yet cover all existing storefront-managed content. A scoped CMS proposal is needed to turn that partial admin surface into a maintainable content workspace without splitting the product into a second project.

## What Changes
- Reorganize the existing `/admin` area into section-based CMS screens inside the current Laravel + Inertia application
- Keep the storefront application unchanged for customers while expanding admin workflows for products, categories, collections, hero banners, promotions, and store locations
- Preserve inventory and order operations inside the same admin workspace so staff do not need a separate tool
- Keep image management URL-based for this increment and defer static-page CMS editing and file uploads to later changes

## Impact
- Affected specs: `admin-cms`
- Affected code: `routes/web.php`, `app/Http/Controllers/Admin/*`, `app/Http/Controllers/StorefrontController.php`, `app/Http/Controllers/StorefrontPageController.php`, `resources/js/Layouts/AdminLayout.jsx`, `resources/js/Pages/Admin/*`, `tests/Feature/Commerce/AdminOperationsTest.php`, `tests/Feature/Commerce/StorefrontTest.php`
