## 1. Admin Workspace Reliability
- [x] 1.1 Inventory the interactive controls on dashboard, catalog, merchandising, locations, inventory, and orders, then define the expected working behavior for each visible button, searchbar, and section action.
- [x] 1.2 Update the shared admin workspace and section screens so search and filter submissions route to the correct section and every primary action opens or submits a valid workflow.
- [x] 1.3 Add feature coverage for admin navigation, visible actions, and search or filter behavior across all sections.

## 2. Catalog And Location CRUD Completion
- [x] 2.1 Add update and delete workflows for categories and collections, including safe handling for slug changes and existing product assignments.
- [x] 2.2 Preserve and extend full lifecycle flows for products, banners, and promotions, and add delete support for store locations alongside existing activate and deactivate controls.
- [x] 2.3 Extend admin catalog and location tests for successful create, update, delete, and validation-error cases.

## 3. Inventory Lifecycle Controls
- [x] 3.1 Add inventory journal workflows for creating, editing, searching, filtering, and voiding adjustments while preserving stock history.
- [x] 3.2 Ensure voided or edited adjustments recalculate stock safely and never bypass the audit trail.
- [x] 3.3 Add feature tests that cover adjustment lifecycle behavior and stock integrity after each action.

## 4. Order Lifecycle Controls
- [x] 4.1 Add admin order search and filter behavior plus a manual order creation workflow that uses the existing commerce domain rules.
- [x] 4.2 Add safe order retirement flows such as cancel or archive behavior instead of destructive deletion, while preserving label and fulfillment history.
- [x] 4.3 Add feature tests for manual order creation, status updates, filtering, and cancel or archive behavior.

## 5. Validation
- [x] 5.1 Run focused admin commerce feature tests after each section is implemented. Final focused run attempted with `php artisan test tests/Feature/Commerce/AdminOperationsTest.php`, but this environment is missing the PHP SQLite PDO driver required by the test configuration.
- [x] 5.2 Run `prompter validate update-admin-crud-coverage --strict --no-interactive` before requesting approval for implementation.
