import providers from '#providers/addon.js';

providers.Item({
    id: 'github',
    name: 'GitHub',
    slug: 'github',
    description: 'Code hosting and collaboration platform.',
    icon: 'github',
    auth_type: 'oauth2',
    auth_config: {
        authorize_url: 'https://github.com/login/oauth/authorize',
        token_url: 'https://github.com/login/oauth/access_token',
        scopes: 'repo,read:user',
        client_id_env: 'GITHUB_CLIENT_ID',
        client_secret_env: 'GITHUB_CLIENT_SECRET',
        token_headers: {
            'Accept': 'application/json'
        }
    },
    base_url: 'https://api.github.com',
    status: 'active'
});
