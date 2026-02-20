import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:collections:items:update',
    provider: 'webflow',
    name: 'Update Collection Item',
    description: 'Update an existing item in a CMS collection.',
    input: {
        collection_id: { type: 'string', required: true, description: 'Collection ID' },
        item_id: { type: 'string', required: true, description: 'Item ID' },
        fields: { type: 'object', required: true, description: 'Field data to update' },
        draft: { type: 'boolean', description: 'Set draft status' },
        archived: { type: 'boolean', description: 'Set archived status' }
    },
    output: {
        id: { type: 'string' },
        fieldData: { type: 'object' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const body = { fieldData: input.fields };

        if(input.draft !== undefined) body.isDraft = input.draft;
        if(input.archived !== undefined) body.isArchived = input.archived;

        const response = await fetch(provider.Get('base_url') + '/collections/' + input.collection_id + '/items/' + input.item_id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(body)
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            id: data.id,
            fieldData: data.fieldData
        });
    }
});
