## MODIFIED Requirements
### Requirement: Inventory Adjustments And Source Synchronization
The system SHALL let operational users record, update, search, filter, reverse, and void stock receipts, manual adjustments, returns, and external source-sync events needed to keep inventory accurate across channels. Inventory delete behavior SHALL preserve history by using reversal or void workflows instead of destructive deletion.

#### Scenario: Physical stock changes after an adjustment
- **WHEN** a staff or admin user records an adjustment or receives a synchronized stock update from another source
- **THEN** the system updates on-hand inventory and preserves the resulting stock history

#### Scenario: Operations user corrects a prior inventory adjustment
- **WHEN** a staff or admin user edits or voids a previously recorded inventory adjustment
- **THEN** the system recalculates the affected stock safely and retains an auditable history of the correction

#### Scenario: Operations user filters inventory activity
- **WHEN** a staff or admin user searches or filters inventory variants or journal entries in the admin workspace
- **THEN** the system returns the matching stock records and adjustments for operational review
