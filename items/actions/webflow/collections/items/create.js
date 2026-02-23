import onetype from 'onetype';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:collections:items:create',
    provider: 'webflow',
    name: 'Create Collection Item',
    description: 'Create a new item in a CMS collection.',
    input: {
        collection_id: { type: 'string', required: true, description: 'Collection ID' },
        fields: { type: 'object', required: true, description: 'Field data (name, slug, and custom fields)' },
        draft: { type: 'boolean', description: 'Create as draft (default true)' }
    },
    output: {
        id: { type: 'string' },
        fieldData: { type: 'object' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/collections/' + input.collection_id + '/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                isDraft: input.draft !== false,
                fieldData: input.fields
            })
        });

        if(!response.ok)
        {
            throw onetype.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            id: data.id,
            fieldData: data.fieldData
        });
    }
});
