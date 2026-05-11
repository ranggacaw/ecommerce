## ADDED Requirements
### Requirement: Shared Storefront And Content-Page Copy Management
The system SHALL allow staff or admins to manage shared storefront shell content and storefront page copy for the About, Contact Us, Terms of Service, and Privacy Policy experiences from the admin merchandising area.

#### Scenario: Team updates global storefront copy
- **WHEN** a staff or admin user saves shared storefront shell content such as the top strip, footer copy, support utility panels, or contact metadata in the merchandising area
- **THEN** the affected storefront layout and page sections render the latest saved content without a code deploy

#### Scenario: Storefront content is first moved into CMS
- **WHEN** shared storefront or content-page copy is introduced to the merchandising workflow
- **THEN** the system preserves the current storefront presentation by seeding editable defaults from the previous hard-coded content
