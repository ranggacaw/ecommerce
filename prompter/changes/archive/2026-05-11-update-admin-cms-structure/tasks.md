## 1. Admin Information Architecture
- [x] 1.1 Restructure the `/admin` routes into dedicated dashboard, catalog, merchandising, store-location, inventory, and order sections
- [x] 1.2 Update the shared admin layout to expose stable navigation across those sections
- [x] 1.3 Reduce the current all-in-one dashboard to an overview page with summary metrics and links into each workflow

## 2. Catalog And CMS Workflows
- [x] 2.1 Move existing product, category, collection, banner, and promotion management into dedicated admin pages while preserving the current validation and redirect patterns
- [x] 2.2 Add store-location management for the existing `store_locations` table, including create or update, activation, and ordering workflows
- [x] 2.3 Keep inventory-adjustment and order-processing entry points integrated in the same admin workspace without introducing a second project or API layer

## 3. Validation
- [x] 3.1 Extend admin feature tests to cover role restrictions, section access, and successful CMS mutations
- [x] 3.2 Extend storefront feature tests to verify storefront pages continue to read updated CMS-managed content
- [x] 3.3 Validate the change with `prompter validate update-admin-cms-structure --strict --no-interactive`

## Post-Implementation
- [x] Update AGENTS.md in the project root for any new CMS conventions introduced by this change
