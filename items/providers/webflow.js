import providers from '#providers/addon.js';

providers.Item({
    id: 'webflow',
    name: 'Webflow',
    slug: 'webflow',
    description: 'Visual web design and CMS platform.',
    icon: 'webflow',
    auth_type: 'oauth2',
    oauth2: {
        authorize_url: 'https://webflow.com/oauth/authorize',
        token_url: 'https://api.webflow.com/oauth/access_token',
        scopes: 'sites:read sites:write pages:read cms:read cms:write',
        client_id_env: 'WEBFLOW_CLIENT_ID',
        client_secret_env: 'WEBFLOW_CLIENT_SECRET',
        callback: function(data)
        {
            return {
                access_token: data.access_token,
                refresh_token: null,
                token_type: data.token_type || 'Bearer',
                expires_at: null,
                scopes: null,
                metadata: {}
            };
        }
    },
    base_url: 'https://api.webflow.com/v2'
});
