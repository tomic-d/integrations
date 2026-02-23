import onetype from 'onetype';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:collections:items:get',
    provider: 'webflow',
    name: 'Get Collection Item',
    description: 'Get a single item from a CMS collection.',
    input: {
        collection_id: { type: 'string', required: true, description: 'Collection ID' },
        item_id: { type: 'string', required: true, description: 'Item ID' }
    },
    output: {
        id: { type: 'string' },
        fieldData: { type: 'object' },
        isDraft: { type: 'boolean' },
        isArchived: { type: 'boolean' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/collections/' + input.collection_id + '/items/' + input.item_id, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if(!response.ok)
        {
            throw onetype.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            id: data.id,
            fieldData: data.fieldData,
            isDraft: data.isDraft,
            isArchived: data.isArchived
        });
    }
});
