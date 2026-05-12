## Context
The existing admin CMS already uses one Laravel + Inertia shell, but the section pages inside that shell do not yet follow one consistent workspace composition. `resources/js/Pages/Admin/Catalog.jsx` is the clearest example of the desired pattern because it combines a section-local search area, record lifecycle actions, a responsive listing surface, and a compact insight area in one flow.

The requested change is to make that composition the reference for admin section/workspace pages so future page creation and page adjustments stay visually and structurally consistent.

## Goals / Non-Goals
- Goals:
- Standardize the internal composition of admin workspace pages around the catalog reference.
- Preserve consistent search, filter, action, responsive listing, and insight placement across Catalog, Merchandising, Locations, Inventory, and Orders.
- Record the pattern in `DESIGN.md` so it becomes the documented default for future admin work.
- Non-Goals:
- Redesign dashboard summary pages into CRUD tables.
- Force record-detail pages such as `OrderShow.jsx` into the same workspace composition.
- Change domain rules that require archive, cancel, or void workflows instead of destructive delete actions.

## Decisions
- Decision: Use `resources/js/Pages/Admin/Catalog.jsx` as the canonical layout reference for admin section/workspace pages.
- Alternatives considered: Creating a brand new abstract admin template first would centralize the pattern, but it would add implementation complexity before the desired page structure is even documented and approved.

- Decision: Standardize the page sequence as search and filters, create or manage actions, responsive listing, then compact insights.
- Alternatives considered: Letting each page choose its own ordering would preserve local flexibility, but it would keep the CMS visually inconsistent and make future admin pages harder to design predictably.

- Decision: Keep section-specific lifecycle actions while standardizing their placement.
- Alternatives considered: Requiring literal create, update, and delete controls on every workspace would conflict with audit-sensitive sections such as inventory and orders, where safe retirement actions are the correct pattern.

- Decision: Treat desktop table plus mobile card fallback as the preferred listing pattern.
- Alternatives considered: Using card-only layouts everywhere would simplify responsive behavior, but it would lose the dense editorial table style already established by the catalog workspace.

## Risks / Trade-offs
- Merchandising contains singleton content editing as well as record management, so its final implementation may need adapted list surfaces that still preserve the shared sequence.
- Over-standardizing the pages too aggressively could make some sections less efficient; the proposal therefore standardizes structure and hierarchy rather than forcing identical component internals.
- This change overlaps with `update-admin-crud-coverage`, so implementation should coordinate both changes to avoid duplicate edits across the same admin pages.

## Migration Plan
1. Update `DESIGN.md` to make the catalog workspace the documented admin reference.
2. Align section/workspace pages to the shared structure one page at a time, preserving existing section-specific domain behavior.
3. Verify responsive behavior and action coverage for each page after alignment.
4. Run strict Prompter validation before requesting implementation approval.

## Open Questions
- None. The scope is limited to admin workspace pages, while dashboard and detail pages remain aligned exceptions.
