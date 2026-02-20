# Integrations

Centralized service for managing third-party API integrations. Handles OAuth2 flows, API key storage, token management, and action execution.

## Architecture

Three addons:

- **providers** — Static definitions of supported services (code-defined, no DB)
- **connections** — User connections with encrypted credentials (DB-backed)
- **actions** — Executable operations per provider (code-defined, no DB)

## Providers

| Provider | Auth Type | Actions |
|---|---|---|
| Slack | oauth2 | send-message, list-channels, create-channel |
| Discord | oauth2 | send-message, list-channels, list-guilds, read-messages |
| GitHub | oauth2 | create-issue, list-repos, create-pr |
| Google Gmail | oauth2 | send-email, list-emails, search-emails |
| Google Calendar | oauth2 | create-event, list-events, delete-event |
| Stripe | api_key | create-customer, list-customers, create-charge |
| Calendly | api_key | list-events, list-event-types |

## Commands

| Command | Method | Endpoint | Description |
|---|---|---|---|
| `providers:list` | GET | /providers | List all providers |
| `connections:create` | POST | /connections/create | Start OAuth flow or save API key |
| `connections:get:many` | GET | /connections | List connections (filterable) |
| `connections:get:one` | GET | /connections/one | Get single connection |
| `connections:delete` | POST | /connections/delete | Revoke and soft-delete |
| `connections:status` | — | — | Check connection health |
| `actions:list` | GET | /actions | List actions (filterable by provider) |
| `actions:run` | POST | /actions/run | Execute an action |
| `health` | — | — | Uptime check |

## Connecting

### OAuth2 (Slack, Discord, GitHub, Google)

```
POST /connections/create
{ "team_id": "123", "provider_id": "slack" }

→ { "authorize_url": "https://slack.com/oauth/v2/authorize?..." }
```

Redirect user to `authorize_url`. After authorization, the OAuth callback (`/oauth/callback`) exchanges the code, runs the provider's callback to normalize credentials, encrypts and stores them.

### API Key (Stripe, Calendly)

```
POST /connections/create
{
    "team_id": "123",
    "provider_id": "stripe",
    "credentials": { "token": "sk_live_xxx" }
}

→ { "connection": { "id": 5, "provider_id": "stripe", "status": "active", ... } }
```

Token is encrypted (AES-256-GCM) and stored. Never returned in any response.

## Running Actions

```
POST /actions/run
{
    "action_id": "slack:send-message",
    "connection_id": "3",
    "input": { "channel": "C123", "text": "Hello" }
}

→ { "result": { "ok": true, "ts": "1234567890.123456" } }
```

The pipeline: validate input → decrypt token (auto-refresh if expired) → execute → return result.

## Token Management

- **OAuth2** — Access tokens are auto-refreshed when expired (5-minute buffer). If refresh fails, connection status becomes `error`.
- **API Key** — Tokens don't expire. Valid until user revokes them.
- All credentials are encrypted with AES-256-GCM. Format: `iv:ciphertext:authTag` (base64).

## Setup

```bash
npm install
```

Required environment variables (see `.env.example`):

- `DB_*` — PostgreSQL connection
- `ENCRYPTION_KEY` — 32-byte hex key for AES-256-GCM
- `OAUTH_REDIRECT_URI` — OAuth callback URL
- Provider credentials (`SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, etc.)

Run the schema:

```bash
psql -f schema.sql
```

Start:

```bash
node index.js
```

gRPC on port 50000, HTTP on port 3000 (OAuth callback only).
