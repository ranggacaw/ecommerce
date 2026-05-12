## Context
The admin CMS already lives inside the Laravel + Inertia application and follows redirect-back form submissions with server-side validation. The current implementation covers the main sections, but lifecycle behavior is uneven across entities and the operational screens are still closer to single-purpose tools than complete admin workspaces.

The user wants the whole admin side cross-checked so that buttons, searchbars, components, and record-management flows are complete. That requires both UI-level consistency and backend behavior changes across catalog, locations, inventory, and orders.

## Goals / Non-Goals
- Goals:
- Make every admin section expose working interaction paths for its visible search, filter, and action controls.
- Provide full create, update, and delete coverage for record-based CMS entities such as categories, collections, products, banners, promotions, and store locations.
- Add operational create and retirement workflows for inventory and orders without losing audit history.
- Preserve the existing Laravel + Inertia admin pattern of server-side validation with redirect-back responses.
- Non-Goals:
- Rebuild the admin into a different architecture or split it into a separate CMS.
- Turn fixed singleton content surfaces such as homepage content and storefront content maps into freely deletable records.
- Introduce file-upload based image management.

## Decisions
- Decision: Keep singleton content records update-only.
- Alternatives considered: Converting homepage and storefront content into multiple create/delete records would satisfy CRUD literally, but it would add unnecessary complexity to fixed storefront surfaces that are already modeled as single records.

- Decision: Treat order and inventory "delete" as safe retirement flows.
- Alternatives considered: Hard-deleting orders or inventory adjustments would make the UI simpler, but it would remove operational history and increase the risk of stock or fulfillment corruption. The proposal therefore uses cancel/archive for orders and reverse/void behavior for inventory adjustments.

- Decision: Use section-level query-driven search and filter behavior.
- Alternatives considered: Keeping search local-only in component state would preserve the current lightweight approach, but it makes toolbar search inconsistent across pages and weakens deep-linking. Query-backed section filters keep behavior predictable without introducing a new frontend state layer.

- Decision: Add feature coverage for every admin section before considering the sweep complete.
- Alternatives considered: Manual smoke testing alone would be faster, but the request is explicitly about the whole admin side working reliably. Feature tests are needed to keep the sweep from regressing.

## Risks / Trade-offs
- Manual order creation touches order totals, line items, shipments, and inventory reservations or commitments. The workflow must stay compatible with existing checkout and fulfillment behavior.
- Reversing inventory adjustments requires careful stock recalculation so that voiding a prior change does not create negative or inconsistent stock states.
- Allowing deletion of categories, collections, or locations can affect storefront navigation and product assignments, so the final implementation will need clear guards for dependent records and safe fallback behavior.
- Expanding search and filter coverage across all admin sections increases controller and page complexity, so the implementation should prefer small, section-specific additions over a large shared abstraction.

## Migration Plan
1. Add any required persistence fields for archival or reversal metadata on operational records.
2. Extend routes, controllers, and page components section by section, preserving redirect-back form handling.
3. Add or expand feature coverage for each new lifecycle and search behavior.
4. Run targeted admin tests and full strict Prompter validation before requesting implementation approval.

## Open Questions
- None. The requested scope includes CMS entities, inventory, and orders, with soft retirement flows for operational deletes.
