-- 1. Create a Super Admin (No tenant_id)
INSERT INTO users (email, password_hash, full_name, role, tenant_id)
VALUES ('superadmin@system.com', 'Admin@123', 'System Super Admin', 'super_admin', NULL);

-- 2. Create a Demo Tenant
INSERT INTO tenants (name, subdomain, status, subscription_plan, max_users, max_projects)
VALUES ('Demo Company', 'demo', 'active', 'pro', 25, 15);

-- 3. Get the ID of the tenant we just created and add an Admin for it
-- (Note: In a real script, we use the generated UUIDs)
INSERT INTO users (email, password_hash, full_name, role, tenant_id)
SELECT 'admin@demo.com', 'Demo@123', 'Demo Admin', 'tenant_admin', id 
FROM tenants WHERE subdomain = 'demo';