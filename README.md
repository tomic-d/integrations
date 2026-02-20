# Integrations

Centralized service for managing third-party API integrations. Handles OAuth2 flows, API key storage, token management, and action execution.

## Architecture

Three addons:

- **providers** — Static definitions of supported services (code-defined, no DB)
- **connections** — User connections with encrypted credentials (DB-backed)
- **actions** — Executable operations per provider (code-defined, no DB)

## Providers

| Provider | ID | Auth Type |
|---|---|---|
| Slack | `slack` | oauth2 |
| Discord | `discord` | oauth2 |
| GitHub | `github` | oauth2 |
| Google Gmail | `google:gmail` | oauth2 |
| Google Calendar | `google:calendar` | oauth2 |
| Stripe | `stripe` | api_key |
| Calendly | `calendly` | api_key |
| Webflow | `webflow` | oauth2 |

## Actions

Action IDs follow the pattern `provider:resource:action`.

### Slack

| Action ID | Description |
|---|---|
| `slack:messages:send` | Send a message to a channel |
| `slack:channels:list` | List workspace channels |
| `slack:channels:create` | Create a new channel |

### Discord

| Action ID | Description |
|---|---|
| `discord:messages:send` | Send a message to a channel |
| `discord:messages:read` | Read message history |
| `discord:channels:list` | List guild channels |
| `discord:guilds:list` | List bot guilds |

### GitHub

| Action ID | Description |
|---|---|
| `github:issues:create` | Create a repository issue |
| `github:repos:list` | List user repositories |
| `github:pull-requests:create` | Create a pull request |

### Google Gmail

| Action ID | Description |
|---|---|
| `google:gmail:emails:send` | Send an email |
| `google:gmail:emails:list` | List inbox emails |
| `google:gmail:emails:search` | Search emails by query |

### Google Calendar

| Action ID | Description |
|---|---|
| `google:calendar:events:create` | Create a calendar event |
| `google:calendar:events:list` | List upcoming events |
| `google:calendar:events:delete` | Delete an event |

### Stripe

| Action ID | Description |
|---|---|
| `stripe:customers:create` | Create a customer |
| `stripe:customers:list` | List customers |
| `stripe:payments:create` | Create a payment intent |

### Calendly

| Action ID | Description |
|---|---|
| `calendly:events:list` | List scheduled events |
| `calendly:event-types:list` | List event types |

### Webflow

| Action ID | Description |
|---|---|
| `webflow:sites:list` | List all sites |
| `webflow:sites:publish` | Publish site to domains |
| `webflow:pages:list` | List site pages |
| `webflow:pages:update` | Update page title, slug, SEO |
| `webflow:collections:list` | List CMS collections |
| `webflow:collections:items:list` | List collection items |
| `webflow:collections:items:get` | Get a single item |
| `webflow:collections:items:create` | Create a collection item |
| `webflow:collections:items:update` | Update a collection item |
| `webflow:collections:items:delete` | Delete a collection item |
| `webflow:collections:items:publish` | Publish staged items to live |

## Commands

| Command | Method | Endpoint | Description |
|---|---|---|---|
| `providers:list` | GET | /providers | List all providers |
| `connections:link` | POST | /connections/link | Start OAuth flow or save API key |
| `connections:get:many` | GET | /connections | List connections (filterable) |
| `connections:get:one` | GET | /connections/one | Get single connection |
| `connections:unlink` | POST | /connections/unlink | Revoke and soft-delete |
| `connections:status` | — | — | Check connection health |
| `actions:list` | GET | /actions | List actions (filterable by provider) |
| `actions:run` | POST | /actions/run | Execute an action |
| `health` | — | — | Uptime check |

## Connecting

### OAuth2 (Slack, Discord, GitHub, Google, Webflow)

```
POST /connections/link
{ "team": "123", "provider": "slack" }

→ { "authorize_url": "https://slack.com/oauth/v2/authorize?..." }
```

Redirect user to `authorize_url`. After authorization, the OAuth callback (`/oauth/callback`) exchanges the code, runs the provider's callback to normalize credentials, encrypts and stores them.

### API Key (Stripe, Calendly)

```
POST /connections/link
{
    "team": "123",
    "provider": "stripe",
    "credentials": { "token": "sk_live_xxx" }
}

→ { "connection": { "id": 5, "provider_id": "stripe", "status": "active", ... } }
```

Token is encrypted (AES-256-GCM) and stored. Never returned in any response.

## Running Actions

```
POST /actions/run
{
    "action": "slack:messages:send",
    "connection": "3",
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
