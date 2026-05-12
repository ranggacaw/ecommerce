## MODIFIED Requirements
### Requirement: Catalog And Merchandising Management
The system SHALL let staff or admins manage products, categories, collections, hero banners, promotions, homepage section content, shared storefront shell content, and storefront page copy using back-office workflows that update storefront-facing data without code changes.

#### Scenario: Merchandiser updates storefront content
- **WHEN** a staff or admin user creates or updates catalog, merchandising, shared storefront, or storefront page content in the CMS
- **THEN** the storefront uses the updated database-backed content in its normal page rendering flows

#### Scenario: Staff member submits invalid storefront content
- **WHEN** a staff or admin user submits invalid homepage, shared-shell, or storefront-page content in the CMS
- **THEN** the system rejects the submission with server-side validation errors and keeps the user in the admin workflow to correct the content
