## MODIFIED Requirements
### Requirement: Operational Order Dashboard
The system SHALL provide staff or admins with an order-management dashboard for creating, searching, filtering, reviewing, updating, cancelling, and archiving orders, along with payment state, fulfillment state, customer information, and order-line details.

#### Scenario: Operations team processes a new order
- **WHEN** a staff or admin user opens a newly placed order
- **THEN** the system shows the data needed to verify payment, prepare fulfillment, and advance the order status

#### Scenario: Operations team creates a manual order
- **WHEN** a staff or admin user enters a new admin-created order with valid customer, line-item, payment, shipment, and address details
- **THEN** the system creates the order inside the existing commerce domain and makes it available in the order dashboard

#### Scenario: Operations team retires an order record
- **WHEN** a staff or admin user cancels or archives an order from the admin workspace
- **THEN** the system preserves operational history while removing that order from active work queues according to its new state

#### Scenario: Operations team filters the order queue
- **WHEN** a staff or admin user searches or filters orders by queue-relevant criteria in the admin workspace
- **THEN** the system returns the matching order records for review and follow-up
