import providers from '#providers/addon.js';

providers.Item({
    id: 'google:calendar',
    name: 'Google Calendar',
    slug: 'google-calendar',
    description: 'Calendar and scheduling by Google.',
    icon: 'google-calendar',
    auth_type: 'oauth2',
    oauth2: {
        authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
        token_url: 'https://oauth2.googleapis.com/token',
        scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
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
    base_url: 'https://www.googleapis.com/calendar/v3'
});
