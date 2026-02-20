import actions from '#actions/addon.js';

actions.Item({
    id: 'stripe:list-customers',
    provider_id: 'stripe',
    name: 'List Customers',
    description: 'List Stripe customers.',
    input: {
        limit: { type: 'number', value: 10, description: 'Max customers to return' }
    },
    output: {
        customers: { type: 'array' }
    },
    execute: async function({ token, input, base_url })
    {
        const params = new URLSearchParams({ limit: input.limit });

        const response = await fetch(base_url + '/customers?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw new Error('Stripe error: ' + error);
        }

        const data = await response.json();

        return {
            customers: data.data.map(c => ({
                id: c.id,
                email: c.email || '',
                name: c.name || '',
                created: c.created
            }))
        };
    }
});
