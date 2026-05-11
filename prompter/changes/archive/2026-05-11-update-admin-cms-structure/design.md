## Context
The current Laravel application already serves both storefront and back-office needs through Inertia pages, shared Eloquent models, and role-guarded `/admin` routes. The requested change is not to create a separate CMS product, but to turn the existing partial admin surface into a cleaner and broader content-management workspace that fits the codebase already in production shape.

## Goals / Non-Goals
- Goals:
  - Keep the CMS in the same repository and application boundary as the storefront
  - Expand the existing admin area into clear content and operations sections
  - Reuse the current data model for products, merchandising content, and store locations
  - Preserve current Laravel controller, validation, redirect, and Inertia page patterns
- Non-Goals:
  - Building a separate admin project or headless CMS service
  - Adding a media upload pipeline in this increment
  - Converting static storefront pages such as About, Contact, and Terms into CMS-managed documents
  - Redesigning multi-variant product modeling beyond the current single-primary-variant workflow

## Decisions
- Decision: Keep the CMS inside the existing Laravel + Inertia application rather than creating a second project.
  - Alternatives considered: a standalone admin project or separate repository. That would duplicate auth, roles, models, migrations, and deployment concerns even though the current codebase already has working admin foundations.
- Decision: Split the current admin dashboard into dedicated section pages instead of continuing to add more forms to one screen.
  - Alternatives considered: keeping all workflows on `Admin/Dashboard.jsx`. That would continue increasing coupling and make content operations harder to navigate and maintain.
- Decision: Limit Increment 1 to existing database-backed content models and operations.
  - Alternatives considered: including static-page CMS editing and file uploads now. Those require new content models or storage workflows that are not necessary to make the current storefront manageable.
- Decision: Keep inventory and order tools in the same admin workspace.
  - Alternatives considered: treating CMS as content-only and moving operations elsewhere. That would fragment staff workflows and does not match the current route and controller structure.

## Risks / Trade-offs
- Splitting one large admin page into several screens introduces more route and controller surface area.
  - Mitigation: keep each new section aligned with existing model boundaries and reuse current form-handling patterns.
- Product editing currently assumes a primary variant workflow.
  - Mitigation: preserve that behavior for this change and defer richer multi-variant authoring to a later proposal.
- The project already has an older completed-but-unarchived commerce proposal.
  - Mitigation: keep this change tightly scoped to the current admin CMS increment and avoid reopening unrelated storefront or checkout requirements.

## Migration Plan
1. Add section-based admin routes and navigation while preserving the current role middleware.
2. Convert the dashboard into an overview page and move content-management forms into dedicated admin pages.
3. Add store-location management using the existing `store_locations` table and model.
4. Verify that storefront home and location pages continue to reflect admin-managed data.
5. Validate the proposal and then implement on a dedicated branch after approval.

## Open Questions
- None for this increment; the same-repository CMS approach and first-slice scope were explicitly chosen during planning.
