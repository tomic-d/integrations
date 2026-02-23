import onetype from 'onetype';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:collections:items:publish',
    provider: 'webflow',
    name: 'Publish Collection Items',
    description: 'Publish staged collection items to live site.',
    input: {
        collection_id: { type: 'string', required: true, description: 'Collection ID' },
        item_ids: { type: 'array', required: true, description: 'Array of item IDs to publish' }
    },
    output: {
        published: { type: 'array' },
        errors: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/collections/' + input.collection_id + '/items/publish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                itemIds: input.item_ids
            })
        });

        if(!response.ok)
        {
            throw onetype.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            published: data.publishedItemIds || [],
            errors: data.errors || []
        });
    }
});
