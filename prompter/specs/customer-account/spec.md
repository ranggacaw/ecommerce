# customer-account Specification

## Purpose
TBD - created by archiving change add-fashion-ecommerce-platform. Update Purpose after archive.
## Requirements
### Requirement: Customer Account Dashboard
The system SHALL provide authenticated customers with an account area for profile management and order-history access.

#### Scenario: Customer reviews prior purchases
- **WHEN** an authenticated customer opens their account dashboard
- **THEN** the system shows their account details and historical orders with status visibility

### Requirement: Address Book And Wishlist Management
The system SHALL allow authenticated customers to store shipping addresses and manage a wishlist tied to their account.

#### Scenario: Customer saves an address and a product
- **WHEN** an authenticated customer adds a shipping address or saves a product to their wishlist
- **THEN** the system persists the data to the customer account for later reuse

