## ADDED Requirements
### Requirement: Shipping Rate Calculation
The system SHALL calculate shipping-cost options from provider-agnostic logistics integrations based on shipment weight and destination.

Related capabilities: `cart-checkout`, `order-management`.

#### Scenario: Checkout requests shipping options
- **WHEN** a shopper provides a destination during checkout
- **THEN** the system returns shipping options and costs derived from the order's shipment weight and location

### Requirement: Courier Tracking Synchronization
The system SHALL synchronize external courier tracking updates into internal shipment and order states.

Related capabilities: `order-management`, `customer-account`.

#### Scenario: Courier marks a parcel as delivered
- **WHEN** the logistics provider reports a shipment status change
- **THEN** the system records the mapped internal status and exposes it in operational and customer-facing order views
