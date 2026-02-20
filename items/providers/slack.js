import providers from '#providers/addon.js';

providers.Item({
    id: 'slack',
    name: 'Slack',
    slug: 'slack',
    description: 'Team messaging and collaboration platform.',
    icon: 'slack',
    auth: {
        type: 'oauth2',
        config: {
            authorize_url: 'https://slack.com/oauth/v2/authorize',
            token_url: 'https://slack.com/api/oauth.v2.access',
            scopes: 'chat:write,channels:read,channels:manage',
            client_id_env: 'SLACK_CLIENT_ID',
            client_secret_env: 'SLACK_CLIENT_SECRET'
        }
    },
    base_url: 'https://slack.com/api',
    callback: function(data)
    {
        return {
            access_token: data.access_token,
            refresh_token: null,
            token_type: data.token_type,
            expires_at: null,
            scopes: data.scope,
            metadata: {
                team: data.team,
                user: data.authed_user
            }
        };
    },
    status: 'active'
});
