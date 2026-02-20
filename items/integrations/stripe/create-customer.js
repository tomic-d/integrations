import actions from '#actions/addon.js';

actions.Item({
    id: 'stripe:create-customer',
    provider_id: 'stripe',
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
    execute: async function({ token, input, base_url })
    {
        const body = new URLSearchParams({ email: input.email });

        if(input.name)
        {
            body.set('name', input.name);
        }

        const response = await fetch(base_url + '/customers', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw new Error('Stripe error: ' + error);
        }

        const data = await response.json();

        return { id: data.id, email: data.email };
    }
});
