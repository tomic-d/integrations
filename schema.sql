-- Integrations service schema
-- Database: iamdejan_db

CREATE TABLE IF NOT EXISTS connections (
    id BIGSERIAL PRIMARY KEY,
    team_id VARCHAR(255),
    provider_id VARCHAR(255),
    status VARCHAR(255),
    credentials TEXT,
    metadata JSONB,
    scopes VARCHAR(255),
    expires_at VARCHAR(255),
    updated_at VARCHAR(255),
    created_at VARCHAR(255),
    deleted_at VARCHAR(255)
);
