import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'stripe:customers:create',
    provider: 'stripe',
    name: 'Create Customer',
    description: 'Create a new Stripe customer.',
    input: {
        email: { type: 'string', required: true, description: 'Customer email' },
        name: { type: 'string', description: 'Customer name' }
    },
    output: {
        id: { type: 'string' },
        email: { type: 'string' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const body = new URLSearchParams({ email: input.email });

        if(input.name) body.set('name', input.name);

        const response = await fetch(provider.Get('base_url') + '/customers', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({ id: data.id, email: data.email });
    }
});
