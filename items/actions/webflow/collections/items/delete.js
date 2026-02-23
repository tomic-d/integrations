import onetype from 'onetype';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:collections:items:delete',
    provider: 'webflow',
    name: 'Delete Collection Item',
    description: 'Delete an item from a CMS collection.',
    input: {
        collection_id: { type: 'string', required: true, description: 'Collection ID' },
        item_id: { type: 'string', required: true, description: 'Item ID' }
    },
    output: {
        deleted: { type: 'boolean' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/collections/' + input.collection_id + '/items/' + input.item_id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if(!response.ok)
        {
            throw onetype.Error(502, await response.text());
        }

        resolve({ deleted: true });
    }
});
