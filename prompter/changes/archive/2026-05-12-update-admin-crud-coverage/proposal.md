# Change: Complete admin workspace interactions and lifecycle coverage

## Why
The current admin CMS exposes the major sections, but several records are still missing full lifecycle controls and some section interactions are inconsistent. Staff can create products, banners, promotions, and locations, but categories and collections are create-only, locations cannot be removed, inventory only supports new adjustments, and orders only support status updates.

## What Changes
- Add a reliability pass for admin section interactions so visible search, filter, and action controls lead to working admin workflows instead of dead-end UI.
- Expand catalog and location management so record-based CMS entities support full create, update, and delete workflows where appropriate.
- Add operational lifecycle controls for inventory and orders using reversible or archival flows instead of destructive deletion for audit-sensitive records.
- Add admin feature coverage for the end-to-end create, update, delete, search, filter, and validation behaviors across all admin sections.

## Impact
- Affected specs: `admin-cms`, `catalog-administration`, `inventory-management`, `order-management`
- Affected code: `routes/web.php`, `app/Http/Controllers/Admin/*`, `resources/js/Layouts/AdminLayout.jsx`, `resources/js/Pages/Admin/*`, `app/Models/*`, `database/migrations/*`, `tests/Feature/Commerce/AdminOperationsTest.php`
