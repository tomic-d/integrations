import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'stripe:list-customers',
    provider: 'stripe',
    name: 'List Customers',
    description: 'List Stripe customers.',
    input: {
        limit: { type: 'number', value: 10, description: 'Max customers to return' }
    },
    output: {
        customers: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const params = new URLSearchParams({ limit: input.limit });

        const response = await fetch(provider.Get('base_url') + '/customers?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            customers: data.data.map(customer => ({
                id: customer.id,
                email: customer.email || '',
                name: customer.name || '',
                created: customer.created
            }))
        });
    }
});
