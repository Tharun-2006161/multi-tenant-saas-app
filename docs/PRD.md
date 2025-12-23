# Product Requirements Document (PRD): Multi-Tenant SaaS

## 1. User Personas
To understand how the system is used, we define three distinct roles:

* **Super Admin:** The "God User" who manages the entire platform. They can see all tenants, change subscription plans, and suspend accounts. They do not belong to any specific organization.
* **Tenant Admin:** The "Manager" of a specific organization. They can add/remove employees from their team, manage billing, and oversee all projects within their company.
* **End User:** The "Worker." They can create projects and tasks, assign them to teammates, and update statuses, but they cannot change company settings or delete other users.

---

## 2. Functional Requirements (FR)
The system must satisfy the following 15+ requirements:

### Authentication & Tenant Management
* **FR-001:** The system shall allow new organizations to register with a unique subdomain.
* **FR-002:** The system shall implement JWT-based authentication for all users.
* **FR-003:** The system shall support subdomain-based login for tenant identification.
* **FR-004:** The system shall provide a logout functionality that clears session data/tokens.

### Data Isolation & Security
* **FR-005:** The system shall isolate all data using a `tenant_id` to prevent cross-tenant access.
* **FR-006:** The system shall enforce Role-Based Access Control (RBAC) at the API level.
* **FR-007:** The system shall allow Super Admins to view and manage all tenants.

### Subscription & Limits
* **FR-008:** The system shall enforce project limits based on plans (Free: 3, Pro: 15, Enterprise: 50).
* **FR-009:** The system shall enforce user limits based on plans (Free: 5, Pro: 25, Enterprise: 100).
* **FR-010:** The system shall default all new registrations to the 'Free' plan.

### Project & Task Management
* **FR-011:** The system shall allow users to create, read, update, and delete (CRUD) projects.
* **FR-012:** The system shall allow users to create tasks within specific projects.
* **FR-013:** The system shall allow tasks to be assigned to specific team members within the tenant.
* **FR-014:** The system shall allow users to filter tasks by status (Todo, In Progress, Completed).
* **FR-015:** The system shall automatically record all major actions in an `audit_logs` table.

---

## 3. Non-Functional Requirements (NFR)
* **NFR-001: Security** - All passwords must be hashed using Bcrypt before being stored in the database.
* **NFR-002: Performance** - API response times should be under 200ms for standard CRUD operations.
* **NFR-003: Availability** - The system should aim for 99% uptime via stable Docker containerization.
* **NFR-004: Scalability** - The database schema must support indexing on `tenant_id` for fast data retrieval.
* **NFR-005: Usability** - The frontend interface must be fully responsive for mobile and desktop views.