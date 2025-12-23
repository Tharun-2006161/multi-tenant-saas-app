-- Up Migration: Create the tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(255) UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('active', 'suspended', 'trial')) DEFAULT 'active',
    subscription_plan TEXT CHECK (subscription_plan IN ('free', 'pro', 'enterprise')) DEFAULT 'free',
    max_users INTEGER NOT NULL,
    max_projects INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration: To undo this change
-- DROP TABLE tenants;