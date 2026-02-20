import providers from '#providers/addon.js';

providers.Item({
    id: 'slack',
    name: 'Slack',
    slug: 'slack',
    description: 'Team messaging and collaboration platform.',
    icon: 'slack',
    auth_type: 'oauth2',
    auth_config: {
        authorize_url: 'https://slack.com/oauth/v2/authorize',
        token_url: 'https://slack.com/api/oauth.v2.access',
        scopes: 'chat:write,channels:read,channels:manage',
        client_id_env: 'SLACK_CLIENT_ID',
        client_secret_env: 'SLACK_CLIENT_SECRET'
    },
    base_url: 'https://slack.com/api',
    status: 'active'
});
