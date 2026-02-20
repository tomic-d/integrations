import providers from '#providers/addon.js';

providers.Item({
    id: 'stripe',
    name: 'Stripe',
    slug: 'stripe',
    description: 'Payment processing platform.',
    icon: 'stripe',
    auth_type: 'api_key',
    api_key: {
        header_name: 'Authorization',
        header_prefix: 'Bearer'
    },
    base_url: 'https://api.stripe.com/v1',
    status: 'active'
});
