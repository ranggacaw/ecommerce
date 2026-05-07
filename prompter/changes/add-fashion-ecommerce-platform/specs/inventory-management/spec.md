## ADDED Requirements
### Requirement: Stock Availability And Reservation Control
The system SHALL maintain stock availability per sellable variant and prevent overselling through reservation-aware order flows.

Related capabilities: `cart-checkout`, `order-management`.

#### Scenario: Last unit is being purchased
- **WHEN** a shopper attempts to purchase the remaining available stock for a variant
- **THEN** the system updates sellable availability in a way that prevents the same stock from being oversold by another order

### Requirement: Inventory Adjustments And Source Synchronization
The system SHALL let operational users record stock receipts, manual adjustments, returns, and external source-sync events needed to keep inventory accurate across channels.

#### Scenario: Physical stock changes after an adjustment
- **WHEN** a staff or admin user records an adjustment or receives a synchronized stock update from another source
- **THEN** the system updates on-hand inventory and preserves the resulting stock history
