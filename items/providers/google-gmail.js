import providers from '#providers/addon.js';

providers.Item({
    id: 'google-gmail',
    name: 'Google Gmail',
    slug: 'google-gmail',
    description: 'Email service by Google.',
    icon: 'gmail',
    auth_type: 'oauth2',
    oauth2: {
        authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
        token_url: 'https://oauth2.googleapis.com/token',
        scopes: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
        client_id_env: 'GOOGLE_CLIENT_ID',
        client_secret_env: 'GOOGLE_CLIENT_SECRET',
        authorize_params: {
            access_type: 'offline',
            prompt: 'consent'
        },
        callback: function(data)
        {
            return {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                token_type: data.token_type,
                expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
                scopes: data.scope,
                metadata: {}
            };
        }
    },
    base_url: 'https://gmail.googleapis.com/gmail/v1'
});
