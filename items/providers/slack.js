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
    callback: function(data)
    {
        return {
            credentials: {
                access_token: data.access_token,
                refresh_token: data.refresh_token || null,
                token_type: data.token_type || 'Bearer'
            },
            expires_at: data.expires_in
                ? new Date(Date.now() + data.expires_in * 1000).toISOString()
                : null,
            scopes: data.scope || '',
            metadata: {
                team: data.team || null,
                user: data.authed_user || null
            }
        };
    },
    status: 'active'
});
