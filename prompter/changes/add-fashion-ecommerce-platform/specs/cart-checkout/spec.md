## ADDED Requirements
### Requirement: Persistent Shopping Bag
The system SHALL provide a shopping bag that persists across browsing sessions and can continue from guest state into an authenticated customer account.

Related capabilities: `customer-account`, `commerce-platform-foundation`.

#### Scenario: Shopper returns to an existing bag
- **WHEN** a shopper returns after leaving the storefront
- **THEN** previously added items remain available in the shopping bag according to the shopper's session or account state

### Requirement: Checkout Workflow
The system SHALL provide a checkout flow that collects customer, shipping, and payment details with an efficient review-and-place-order experience.

Related capabilities: `fulfillment-integrations`, `order-management`.

#### Scenario: Shopper places an order
- **WHEN** a shopper completes the checkout form with valid shipping and payment selections
- **THEN** the system creates an order and presents the resulting payment or confirmation state

### Requirement: Payment Method Support
The system SHALL support e-wallet, bank transfer, and card payment methods through provider-agnostic payment integrations.

Related capabilities: `commerce-platform-foundation`, `fulfillment-integrations`.

#### Scenario: Checkout offers multiple payment methods
- **WHEN** a shopper reaches the payment step of checkout
- **THEN** the system presents the supported payment methods and records the selected payment state against the order
