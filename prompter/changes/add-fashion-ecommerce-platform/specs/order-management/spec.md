## ADDED Requirements
### Requirement: Operational Order Dashboard
The system SHALL provide staff or admins with an order-management dashboard for reviewing payment state, fulfillment state, customer information, and order-line details.

#### Scenario: Operations team processes a new order
- **WHEN** a staff or admin user opens a newly placed order
- **THEN** the system shows the data needed to verify payment, prepare fulfillment, and advance the order status

### Requirement: Shipment Label And Status Workflows
The system SHALL support printable shipment-label workflows and status updates that keep internal users and customers aligned on fulfillment progress.

Related capabilities: `fulfillment-integrations`, `customer-account`.

#### Scenario: Order advances to shipment
- **WHEN** an order is ready for dispatch or receives a courier status update
- **THEN** the system updates the shipment record and exposes the latest fulfillment state to operational users and customers
