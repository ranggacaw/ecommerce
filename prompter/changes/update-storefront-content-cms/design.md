## Context
The storefront already has a partial merchandising CMS: hero banners, promotions, and homepage-only copy are editable through the existing Laravel + Inertia admin application. The remaining customer-facing brand and support content is still hard-coded across `StorefrontLayout.jsx`, `StorefrontFooter.jsx`, `About.jsx`, `ContactUs.jsx`, and `TermsPolicy.jsx`, which forces developer involvement for routine content updates.

## Goals / Non-Goals
- Goals: Let staff manage shared storefront shell content and key content pages from the existing admin merchandising area.
- Goals: Preserve the current admin pattern of server-side validation and redirect-back form submissions.
- Goals: Preserve current public routes and seed defaults so rollout does not change the visible storefront unexpectedly.
- Non-Goals: Building a general page-builder or arbitrary component composer.
- Non-Goals: Replacing catalog-driven content such as products, categories, collections, or promotions that already come from first-class models.
- Non-Goals: Introducing file uploads for page media in this change.

## Decisions
- Decision: Keep this work inside the existing admin merchandising area instead of creating a new top-level CMS section.
  Rationale: The project already groups storefront-facing editorial work under merchandising, and the root project instructions require section-based admin screens inside the current Laravel + Inertia application.

- Decision: Use a generalized storefront content persistence pattern for non-home content instead of continuing to add page-specific hard-coded arrays.
  Rationale: Homepage content is already structured as database-backed JSON sections. Extending the same section-oriented idea to shell, About, Contact, and legal content keeps the implementation familiar while avoiding a new model for every page subsection.

- Decision: Split content updates by named section payloads with explicit validation rules.
  Rationale: This matches the current `HomepageContent` workflow, keeps forms independently saveable, and limits validation errors to the content block the merchandiser is editing.

- Decision: Seed editable defaults from the current storefront markup and content constants during migration.
  Rationale: The current hard-coded pages are the effective production baseline, so seeding from them prevents regressions when the content source moves to CMS-managed records.

## Risks / Trade-offs
- Risk: Large nested JSON payloads can become hard to reason about if too many unrelated fields share one save action.
  Mitigation: Keep the admin UI split into page-level or section-level forms and save each section independently.

- Risk: Legal content changes can have higher business sensitivity than marketing copy.
  Mitigation: Keep legal sections explicitly separated in the admin UI and validate required headings, dates, and body content fields before saving.

- Risk: The existing `homepage_contents` table is specialized for home page sections only.
  Mitigation: Introduce a content storage pattern that clearly distinguishes homepage content from broader storefront page content, even if both use similar JSON-backed section structures.

## Migration Plan
1. Add the new storefront content persistence layer and seed records from current hard-coded shell/page content.
2. Expose the records through the existing merchandising controller and page.
3. Switch public storefront pages and shared layout/footer components to read the saved records.
4. Cover the migration with admin and storefront feature tests that assert seeded defaults and saved updates render correctly.

## Open Questions
- None. The requested scope is the full storefront content audit covering editable shared shell and content pages.
