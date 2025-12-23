# Research Document: Multi-Tenant SaaS Platform - Project & Task Management System

## 1. Multi-Tenancy Architecture Analysis
Multi-tenancy is the backbone of Software as a Service (SaaS). It allows a single software instance to serve multiple organizations (tenants) while making each organization feel like they have their own private system. In this research, I have analyzed the three primary architectural patterns for data isolation.

### 1.1 Approach Comparison Table

| Feature | Shared Database + Shared Schema | Shared Database + Separate Schema | Separate Database |
| :--- | :--- | :--- | :--- |
| **Data Isolation** | Logical isolation via `tenant_id` column. | Better isolation via database namespaces. | Physical isolation on separate servers. |
| **Infrastructure Cost** | Lowest. All tenants share one database. | Medium. One database, but complex metadata. | Highest. One database instance per tenant. |
| **Operational Effort** | Simple. One set of migrations for all. | Complex. Must update every schema. | Very High. Hundreds of servers to patch. |
| **Development Speed** | Fast. Standard CRUD operations. | Medium. Requires dynamic schema routing. | Slow. Requires complex orchestration. |

### 1.2 Detailed Analysis of Approaches

**The "Separate Database" Approach:** This is often used for high-security clients like banks or government agencies. Because each tenant has their own physical database, there is zero risk of "Data Leaking" (where Tenant A sees Tenant B's data). However, for a startup or a general-purpose SaaS, this is extremely expensive. If we have 1,000 tenants, we must pay for 1,000 database instances. It also makes "Global Analytics" (seeing how the whole app is performing) nearly impossible.

**The "Shared Database + Separate Schema" Approach:** In this model, every tenant stays in one database but gets their own "Schema" (like a private folder of tables). While this provides better security than a shared schema, it creates a "Migration Nightmare." Every time we want to add a new feature (like a "due date" to a task), we have to run that update 1,000 times for 1,000 schemas. This increases the chance of the system breaking.

**The Chosen Approach: Shared Database + Shared Schema:** I have chosen this approach for this project. It is the most modern and scalable way to build a SaaS. We use a single database and single set of tables. We add a `tenant_id` column to every single table (Users, Projects, Tasks). This is cost-effective, easy to maintain, and allows us to scale to thousands of users on a single database server.

---

## 2. Technology Stack Justification

### 2.1 Backend: Node.js with Express.js
Node.js was selected because of its event-driven, non-blocking I/O model. This makes it incredibly efficient for a Project Management tool where many users might be updating task statuses simultaneously. Express.js is a "minimalist" framework, which is perfect for a beginner-to-intermediate project because it forces the developer to understand how **Middleware** works—which is how we will enforce tenant security.

### 2.2 Frontend: React.js
React is the industry standard for building "Single Page Applications" (SPAs). For a dashboard-heavy app like this, React allows us to update the UI (like moving a task from "Todo" to "Done") without refreshing the entire page. Its component-based architecture also makes it easy to build a "Role-Based UI" where certain buttons are hidden for regular users but visible to admins.

### 2.3 Database: PostgreSQL
I chose PostgreSQL over NoSQL options (like MongoDB) because this project requires strict "Relational" data. Projects contain Tasks. Tenants contain Users. PostgreSQL uses **Foreign Key Constraints** to ensure that data remains clean. For example, if a Tenant is deleted, PostgreSQL can automatically delete all associated projects and tasks (Cascade Delete), preventing "orphan data" from piling up.

### 2.4 Authentication: JSON Web Tokens (JWT)
JWTs are ideal for SaaS applications. Instead of the server remembering every logged-in user (Session-based), the server gives the user a "Token" (like a digital ID card). This card contains the `userId`, their `role`, and most importantly, their `tenantId`. This makes our API "stateless" and much faster.

---

## 3. Security & Data Isolation Considerations

### 3.1 Logical Data Isolation
Our primary security measure is the "Tenant Filter." Every time a user requests a list of tasks, our backend will not just say `SELECT * FROM tasks`. Instead, it will automatically look at the user's JWT, find their `tenant_id`, and run `SELECT * FROM tasks WHERE tenant_id = 'XYZ'`. This ensures that even if a user is a hacker and tries to guess a project ID, the system will block them if that project belongs to another company.

### 3.2 Subdomain Identification
By requiring a "Tenant Subdomain" (e.g., `company.myapp.com`), we add an extra layer of identification. This prevents "Cross-Tenant" attacks and makes the login process more professional and secure for the end-user.

### 3.3 Subscription Limit Enforcement
A key part of a SaaS is making money. We will implement code that checks a tenant's "Plan" (Free, Pro, Enterprise) before they perform an action. For example, before saving a new project, the code will count the existing projects. If they are on the "Free Plan" and already have 3 projects, the API will return a `403 Forbidden` error.

### 3.4 Password Hashing (Bcrypt)
Security is paramount for high-paying roles. We will never store a user's password in the database as plain text. We will use **Bcrypt** with a "Salt" to scramble the password. Even if our database is stolen, the passwords will be useless to the hackers.

---

## 4. Scalability and Performance
To ensure the app remains fast as it grows, we will implement **Database Indexing**. By creating an Index on the `tenant_id` column in every table, PostgreSQL can find a specific company's data in milliseconds, even if there are millions of rows in the table. We will also use **Docker** to containerize the application, allowing us to deploy the exact same environment on a developer's laptop as we do on a production cloud server.