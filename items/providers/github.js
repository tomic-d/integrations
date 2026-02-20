import providers from '#providers/addon.js';

providers.Item({
    id: 'github',
    name: 'GitHub',
    slug: 'github',
    description: 'Code hosting and collaboration platform.',
    icon: 'github',
    auth: {
        type: 'oauth2',
        config: {
            authorize_url: 'https://github.com/login/oauth/authorize',
            token_url: 'https://github.com/login/oauth/access_token',
            scopes: 'repo,read:user',
            client_id_env: 'GITHUB_CLIENT_ID',
            client_secret_env: 'GITHUB_CLIENT_SECRET',
            token_headers: {
                'Accept': 'application/json'
            }
        }
    },
    base_url: 'https://api.github.com',
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
            metadata: {}
        };
    },
    status: 'active'
});
