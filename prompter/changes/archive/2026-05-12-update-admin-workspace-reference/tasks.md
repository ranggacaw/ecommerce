## 1. Reference Definition
- [x] 1.1 Review `resources/js/Pages/Admin/Catalog.jsx` and extract the shared admin workspace structure that other section pages must follow.
- [x] 1.2 Update `DESIGN.md` with the admin CMS reference layout, required sections, responsive behavior, and exception rules.

## 2. Workspace Alignment
- [x] 2.1 Align `Merchandising.jsx`, `Locations.jsx`, `Inventory.jsx`, and `Orders.jsx` to the catalog-derived workspace pattern while preserving each section's domain-specific actions.
- [x] 2.2 Keep `Dashboard.jsx` and `OrderShow.jsx` visually aligned with the admin shell and tokens without forcing them into the full search, CRUD, table, and insight layout.
- [x] 2.3 Reconcile implementation sequencing with `prompter/changes/update-admin-crud-coverage/`, because both changes touch shared admin section workflows and page structure.

## 3. Validation
- [x] 3.1 Verify desktop and mobile behavior for each affected admin workspace page, including search, actions, responsive listing, and the insight block.
- [x] 3.2 Run relevant verification commands. `npm run build` passed. `php artisan test tests/Feature/Commerce/AdminOperationsTest.php` was attempted, but this environment is missing the PHP SQLite PDO driver required by the test configuration.
- [x] 3.3 Run `prompter validate update-admin-workspace-reference --strict --no-interactive` before requesting implementation approval.
