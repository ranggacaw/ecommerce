## Context
The current admin CMS already manages hero banners and promotions inside the existing Laravel + Inertia application, but much of the homepage presentation is still hard-coded in `resources/js/Pages/Storefront/Home.jsx`. The requested scope is homepage only: staff should be able to update the hero presentation and surrounding homepage merchandising copy from the admin side without creating a separate page-builder system.

## Goals / Non-Goals
- Goals: Let staff edit homepage-only merchandising copy and links from the current admin area.
- Goals: Keep the implementation aligned with the existing section-based `Merchandising` screen and server-side validation plus redirect-back submissions.
- Goals: Preserve current dynamic sources for categories, collections, featured products, and URL-based image management.
- Non-Goals: Making `About`, `Contact Us`, `Terms & Policy`, or other storefront pages editable in this change.
- Non-Goals: Introducing a generic CMS/page-builder framework.
- Non-Goals: Adding file uploads for homepage media.

## Decisions
- Decision: Use a dedicated homepage-content persistence record rather than a generic site-settings system.
  Rationale: The requested scope is one page with a known set of editable sections, so a dedicated model keeps the implementation smaller and easier to validate.
- Decision: Keep homepage content editing inside the existing `Merchandising` admin screen.
  Rationale: This matches the current admin navigation and the project instruction to keep the admin CMS inside the existing Laravel + Inertia application.
- Decision: Keep catalog-driven tiles and product grids sourced from existing models, and only move surrounding homepage copy, CTA labels, links, and promo messaging into CMS-managed content.
  Rationale: Categories, collections, banners, and featured products already provide the dynamic merchandising data; the missing gap is the hard-coded copy around them.
- Decision: Seed the initial homepage content with the current storefront defaults.
  Rationale: This prevents blank sections after deployment and preserves the live presentation until staff intentionally change it.

## Risks / Trade-offs
- Risk: Homepage content can drift away from the catalog data it surrounds.
  Mitigation: Keep category, collection, and featured-product selection derived from existing models and limit the CMS change to copy, labels, links, and supporting promo text.
- Risk: A single generic settings table could overreach and complicate validation.
  Mitigation: Use a homepage-specific persistence shape with explicit fields and structured validation.
- Risk: The current flash-sale presentation contains hard-coded promotional language and countdown visuals.
  Mitigation: Treat flash-sale copy as editable content in this change and define any future real countdown behavior separately if needed.

## Migration Plan
1. Add homepage content persistence with defaults matching the current homepage copy.
2. Load and update that content through the existing admin merchandising workflow.
3. Switch storefront home rendering from hard-coded strings to CMS-backed values.
4. Verify the homepage still renders meaningful defaults before any staff edits.

## Open Questions
- None for the homepage-only scope selected for this proposal.
