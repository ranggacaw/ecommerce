# Change: Add homepage content CMS controls

## Why
The storefront homepage still relies on hard-coded copy and links for several merchandising sections, which means staff need a developer to change routine campaign content. Moving homepage-only content into the existing admin merchandising workflow will let staff update hero messaging, promo copy, section headings, and editorial content without code changes.

## What Changes
- Extend homepage merchandising from hero banners and promo collections to include CMS-managed homepage section copy, labels, links, and supporting promo content.
- Keep the feature inside the existing Laravel + Inertia admin area under the current `Merchandising` section.
- Preserve current dynamic catalog sources for categories, collections, and featured products while replacing homepage hard-coded surrounding copy with database-backed content.
- Seed the new homepage content record with the current storefront defaults so the homepage does not lose content on rollout.

## Impact
- Affected specs: `admin-cms`, `catalog-administration`, `storefront-catalog`
- Affected code: `app/Http/Controllers/Admin/CatalogController.php`, `app/Http/Controllers/StorefrontController.php`, `resources/js/Pages/Admin/Merchandising.jsx`, `resources/js/Pages/Storefront/Home.jsx`, new homepage content persistence model and migration
