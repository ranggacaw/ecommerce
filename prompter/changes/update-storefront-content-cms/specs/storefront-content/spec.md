## ADDED Requirements
### Requirement: CMS-Managed Shared Storefront Shell
The system SHALL render editable shared storefront shell content, including the top brand strip, footer brand copy and support links, and bottom utility-panel messaging, from CMS-managed records instead of hard-coded page constants.

Related capabilities: `admin-cms`, `catalog-administration`.

#### Scenario: Merchandiser updates shared storefront shell content
- **WHEN** staff save updated shared shell content in the CMS
- **THEN** storefront pages that use the shared layout render the latest saved content in the top strip, footer, and utility panels

### Requirement: CMS-Managed Storefront Content Pages
The system SHALL render editable About, Contact Us, Terms of Service, and Privacy Policy content from CMS-managed records while preserving their existing routes and overall page structures.

Related capabilities: `admin-cms`, `catalog-administration`.

#### Scenario: Team updates page content
- **WHEN** staff change About page sections, contact support content, or legal page body content in the CMS
- **THEN** the corresponding storefront page shows the saved content without a code deploy

#### Scenario: Existing hard-coded content is migrated
- **WHEN** the storefront content-page CMS capability is introduced
- **THEN** the system seeds editable defaults from the current hard-coded page content so the customer-facing experience does not regress on rollout
