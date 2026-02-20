import providers from '#providers/addon.js';

providers.Item({
    id: 'stripe',
    name: 'Stripe',
    slug: 'stripe',
    description: 'Payment processing platform.',
    icon: 'stripe',
    auth: {
        type: 'api_key',
        config: {
            header_name: 'Authorization',
            header_prefix: 'Bearer'
        }
    },
    base_url: 'https://api.stripe.com/v1',
    status: 'active'
});
