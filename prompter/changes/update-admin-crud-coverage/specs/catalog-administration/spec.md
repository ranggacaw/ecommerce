## MODIFIED Requirements
### Requirement: Product And Promotion CMS
The system SHALL provide back-office workflows for staff or admins to create, update, publish, unpublish, and delete products, variants, categories, collections, prices, and promotions without changing application code.

#### Scenario: Merchandiser publishes a campaign product
- **WHEN** a staff or admin user updates product, pricing, or promo data in the back office
- **THEN** the storefront reflects the new catalog state through normal publishing workflows

#### Scenario: Merchandiser removes obsolete taxonomy or campaign data
- **WHEN** a staff or admin user deletes a category, collection, product, variant-backed product record, price-bearing product record, or promotion from the back office
- **THEN** the system removes or safely detaches that catalog data without requiring application code changes

### Requirement: Storefront Merchandising Controls
The system SHALL allow staff or admins to create, update, reorder, activate, deactivate, and delete hero banners, new-arrivals groupings, promo collections, and homepage hero call-to-action content used by the storefront.

#### Scenario: Team updates the seasonal hero banner
- **WHEN** a staff or admin user changes active hero banner copy, imagery, order, or call-to-action links
- **THEN** the storefront home page uses the updated hero presentation

#### Scenario: Team deletes a retired hero banner
- **WHEN** a staff or admin user deletes a hero banner that is no longer needed
- **THEN** the storefront stops rendering that banner in future home page responses
