# Change: Standardize admin workspace pages from the catalog reference

## Why
The admin shell is already shared, but the internal page composition still varies between sections. The team wants new and adjusted admin workspace pages to use `resources/js/Pages/Admin/Catalog.jsx` as the reference so the CMS keeps a consistent UI and UX.

## What Changes
- Define a shared admin workspace composition based on `resources/js/Pages/Admin/Catalog.jsx` for section/workspace pages.
- Require a consistent sequence of section search and filters, record-management actions, responsive list or table workspace, and a compact insight or mini-graph area.
- Document that dashboard summary pages and record-detail pages are aligned to the same shell but are not forced into the full catalog workspace structure.
- Update `DESIGN.md` so future admin page creation and page adjustments use the same reference.

## Impact
- Affected specs: `admin-cms`
- Affected code: `DESIGN.md`, `resources/js/Pages/Admin/Catalog.jsx`, `resources/js/Pages/Admin/Merchandising.jsx`, `resources/js/Pages/Admin/Locations.jsx`, `resources/js/Pages/Admin/Inventory.jsx`, `resources/js/Pages/Admin/Orders.jsx`, `resources/js/Pages/Admin/Dashboard.jsx`, `resources/js/Pages/Admin/OrderShow.jsx`
