import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:sites:publish',
    provider: 'webflow',
    name: 'Publish Site',
    description: 'Publish a Webflow site to its custom domains.',
    input: {
        site_id: { type: 'string', required: true, description: 'Site ID' }
    },
    output: {
        published: { type: 'boolean' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/sites/' + input.site_id + '/publish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                publishToWebflowSubdomain: true
            })
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        resolve({ published: true });
    }
});
