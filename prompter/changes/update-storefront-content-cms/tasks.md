## 1. Content persistence
- [x] 1.1 Introduce a storefront content persistence pattern for shared shell content and non-home storefront pages, with seeded defaults copied from the current hard-coded storefront copy.
- [x] 1.2 Define stable section keys and payload shapes for global shell, About, Contact, Terms of Service, and Privacy Policy content without breaking the existing homepage content workflow.

## 2. Admin merchandising workflows
- [x] 2.1 Extend the merchandising controller and routes to load and update storefront shell, About, Contact, and legal content using server-side validation plus redirect-back responses.
- [x] 2.2 Expand `resources/js/Pages/Admin/Merchandising.jsx` with grouped section forms for shell copy, About content blocks, contact/support details, and legal content editing.

## 3. Storefront rendering
- [x] 3.1 Update `resources/js/Layouts/StorefrontLayout.jsx` and `resources/js/Components/Storefront/StorefrontFooter.jsx` to render CMS-managed shell content while preserving existing storefront navigation and utility flows.
- [x] 3.2 Update `app/Http/Controllers/StorefrontPageController.php` plus the `About`, `ContactUs`, and `TermsPolicy` pages to render saved CMS content with the seeded defaults.

## 4. Verification
- [x] 4.1 Add feature coverage for admin updates to shared storefront and page content in `tests/Feature/Commerce/AdminOperationsTest.php`.
- [x] 4.2 Add storefront rendering coverage for shared shell and content pages in `tests/Feature/Commerce/StorefrontTest.php`.
- [x] 4.3 Run `php artisan test --filter=AdminOperationsTest`, `php artisan test --filter=StorefrontTest`, and the repo-standard frontend validation command (`npm run build`). The PHP test commands were invoked but this environment is missing the SQLite driver required by the test configuration; the frontend build passed.
