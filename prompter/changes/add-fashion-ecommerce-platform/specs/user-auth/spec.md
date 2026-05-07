## ADDED Requirements
### Requirement: Customer Authentication Flows
The system SHALL provide customer registration, login, logout, password reset, and session handling within the Laravel + Inertia application.

#### Scenario: Visitor creates an account
- **WHEN** a visitor submits valid registration details
- **THEN** the system creates a customer account and grants access to authenticated account features

#### Scenario: Customer signs in
- **WHEN** a customer submits valid credentials
- **THEN** the system authenticates the customer and restores access to their saved account data

### Requirement: Role-Based Operational Access
The system SHALL support at least `customer`, `staff`, and `admin` roles for access to customer and operational interfaces.

#### Scenario: Staff accesses back-office features
- **WHEN** a user with a `staff` or `admin` role opens an operational route
- **THEN** the application authorizes that user without granting the same access to standard customers
