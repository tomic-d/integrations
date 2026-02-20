import providers from '#providers/addon.js';

providers.Item({
    id: 'google-gmail',
    name: 'Google Gmail',
    slug: 'google-gmail',
    description: 'Email service by Google.',
    icon: 'gmail',
    auth_type: 'oauth2',
    auth_config: {
        authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
        token_url: 'https://oauth2.googleapis.com/token',
        scopes: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
        client_id_env: 'GOOGLE_CLIENT_ID',
        client_secret_env: 'GOOGLE_CLIENT_SECRET',
        extra_params: {
            access_type: 'offline',
            prompt: 'consent'
        }
    },
    base_url: 'https://gmail.googleapis.com/gmail/v1',
    status: 'active'
});
