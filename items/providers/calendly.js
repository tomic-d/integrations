import providers from '#providers/addon.js';

providers.Item({
    id: 'calendly',
    name: 'Calendly',
    slug: 'calendly',
    description: 'Scheduling and appointment platform.',
    icon: 'calendly',
    auth: {
        type: 'pat',
        config: {
            header_name: 'Authorization',
            header_prefix: 'Bearer'
        }
    },
    base_url: 'https://api.calendly.com',
    status: 'active'
});
