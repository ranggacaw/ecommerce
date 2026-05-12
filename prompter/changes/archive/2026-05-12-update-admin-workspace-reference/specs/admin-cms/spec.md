## ADDED Requirements
### Requirement: Catalog-Referenced Admin Workspace Composition
The system SHALL make each admin section/workspace page use `resources/js/Pages/Admin/Catalog.jsx` as the structural UI reference. Workspace pages that manage records or editable content collections SHALL present a section-local search or filter area, visible create or management actions, a responsive primary listing surface, and a compact insight or mini-graph area in a consistent top-to-bottom sequence. Summary-only pages such as the admin dashboard and record-detail pages such as order detail are excluded from this strict composition but SHALL remain visually aligned to the shared admin shell and design tokens.

#### Scenario: Team creates a new admin workspace page
- **WHEN** a team member adds a new admin workspace page for a CMS or operations section
- **THEN** the page follows the catalog reference structure with section search or filter controls, visible management actions, a responsive list or table surface, and a compact insight area

#### Scenario: Team adjusts an existing admin workspace page
- **WHEN** a team member updates Catalog, Merchandising, Locations, Inventory, or Orders in the admin interface
- **THEN** the revised page preserves the same catalog-referenced sequence and responsive behavior instead of introducing a different page structure

#### Scenario: A workspace uses safe retirement actions instead of delete
- **WHEN** an admin workspace belongs to a domain that must preserve audit history, such as inventory or orders
- **THEN** the page keeps the same shared action placement while using safe lifecycle actions such as void, archive, or cancel in place of destructive delete controls
