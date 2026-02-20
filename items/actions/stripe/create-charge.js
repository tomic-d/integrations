import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'stripe:create-charge',
    provider: 'stripe',
    name: 'Create Payment Intent',
    description: 'Create a Stripe payment intent.',
    input: {
        amount: { type: 'number', required: true, description: 'Amount in cents' },
        currency: { type: 'string', required: true, description: 'Currency code (e.g. usd, eur)' },
        customer: { type: 'string', description: 'Customer ID' },
        description: { type: 'string', description: 'Payment description' }
    },
    output: {
        id: { type: 'string' },
        status: { type: 'string' },
        client_secret: { type: 'string' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const body = new URLSearchParams({
            amount: input.amount,
            currency: input.currency
        });

        if(input.customer)
        {
            body.set('customer', input.customer);
        }

        if(input.description)
        {
            body.set('description', input.description);
        }

        const response = await fetch(provider.Get('base_url') + '/payment_intents', {
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
            throw divhunt.Error(502, error);
        }

        const data = await response.json();

        resolve({ id: data.id, status: data.status, client_secret: data.client_secret });
    }
});
