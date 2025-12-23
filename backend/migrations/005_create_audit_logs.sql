-- Up Migration: Create the audit_logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL, -- e.g., 'CREATE_USER', 'DELETE_PROJECT'
    entity_type VARCHAR(100),    -- e.g., 'user', 'project', 'task'
    entity_id UUID,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add an index so the Super Admin can search logs quickly
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);