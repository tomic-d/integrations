import providers from '#providers/addon.js';

providers.Item({
    id: 'google-calendar',
    name: 'Google Calendar',
    slug: 'google-calendar',
    description: 'Calendar and scheduling by Google.',
    icon: 'google-calendar',
    auth_type: 'oauth2',
    auth_config: {
        authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
        token_url: 'https://oauth2.googleapis.com/token',
        scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        client_id_env: 'GOOGLE_CLIENT_ID',
        client_secret_env: 'GOOGLE_CLIENT_SECRET',
        extra_params: {
            access_type: 'offline',
            prompt: 'consent'
        }
    },
    base_url: 'https://www.googleapis.com/calendar/v3',
    status: 'active'
});
