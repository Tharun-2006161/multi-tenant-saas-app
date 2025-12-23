# Architecture Document: Multi-Tenant SaaS Platform

## 1. System Architecture
This application follows a classic 3-tier architecture, fully containerized using Docker for consistency across development and production environments.

* **Frontend:** React.js Single Page Application (SPA) served on Port 3000.
* **Backend:** Node.js/Express REST API served on Port 5000.
* **Database:** PostgreSQL Relational Database served on Port 5432.

### Request Flow & Tenant Identification
The system supports two methods of identifying the tenant to ensure compatibility with local development and production environments:

1. **Production (Subdomain):** The frontend extracts the tenant identifier from the window URL (e.g., `tenant-a.myapp.com`).
2. **Local Development/Evaluation:** During login at `localhost:3000`, the user provides the `tenantSubdomain` in the login request body.
3. **Session Management:** Once authenticated, the Backend verifies the user belongs to that specific tenant and issues a JWT containing `tenant_id`, `userId`, and `role`.
4. **Data Isolation:** For all subsequent requests, the `tenant_id` is extracted strictly from the JWT payload. The Backend uses this ID to filter all SQL queries (e.g., `WHERE tenant_id = ?`).

---

## 2. Database Schema (ERD)
The database is designed with **Referential Integrity** and **Cascade Deletes** to ensure no "orphan" data remains if a tenant is removed.

![Database ERD](./images/database-erd.png)

### Core Tables:
* **tenants:** Stores organization name, subdomain, and subscription plan (Free, Pro, Enterprise).
* **users:** Stores user credentials and roles. Linked to `tenants` via `tenant_id`.
* **projects:** Stores project details. Linked to `tenants` via `tenant_id`.
* **tasks:** Stores individual tasks. Linked to `projects` and `tenants`.
* **audit_logs:** Records every "Create, Update, Delete" action for security and compliance.

---

## 3. API Endpoint Specification (The 19 Endpoints)
All APIs follow a consistent response format: `{success: boolean, message: string, data: object}`.

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/register-tenant` | Public tenant & admin registration |
| **Auth** | POST | `/api/auth/login` | Get JWT token (24h expiry) |
| **Auth** | GET | `/api/auth/me` | Get current user & tenant info |
| **Tenants** | GET | `/api/tenants/:id` | Get organization details & stats |
| **Tenants** | PUT | `/api/tenants/:id` | Update plan/status (Super Admin only) |
| **Tenants** | GET | `/api/tenants` | List all tenants (Super Admin only) |
| **Users** | POST | `/api/tenants/:id/users` | Add team member (Check plan limits) |
| **Users** | GET | `/api/tenants/:id/users` | List team members |
| **Users** | PUT | `/api/users/:id` | Update user profile/role |
| **Users** | DELETE | `/api/users/:id` | Remove user from tenant |
| **Projects** | POST | `/api/projects` | Create new project (Check plan limits) |
| **Projects** | GET | `/api/projects` | List projects for the authenticated tenant |
| **Projects** | PUT | `/api/projects/:id` | Update project name/status |
| **Projects** | DELETE | `/api/projects/:id` | Delete project and its tasks |
| **Tasks** | POST | `/api/projects/:id/tasks` | Create task within a project |
| **Tasks** | GET | `/api/projects/:id/tasks` | List tasks in a specific project |
| **Tasks** | PATCH | `/api/tasks/:id/status` | Quick status update (Todo/Doing/Done) |
| **Tasks** | PUT | `/api/tasks/:id` | Full task edit |
| **Health** | GET | `/api/health` | Returns system and DB connection status |