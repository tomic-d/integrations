import onetype from 'onetype';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:collections:items:list',
    provider: 'webflow',
    name: 'List Collection Items',
    description: 'List items in a CMS collection.',
    input: {
        collection_id: { type: 'string', required: true, description: 'Collection ID' },
        limit: { type: 'number', description: 'Max items to return (default 100)' },
        offset: { type: 'number', description: 'Pagination offset' }
    },
    output: {
        items: { type: 'array' },
        total: { type: 'number' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const params = new URLSearchParams();

        if(input.limit) params.set('limit', input.limit);
        if(input.offset) params.set('offset', input.offset);

        const query = params.toString();
        const url = provider.Get('base_url') + '/collections/' + input.collection_id + '/items' + (query ? '?' + query : '');

        const response = await fetch(url, {
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
            items: data.items.map(item => ({
                id: item.id,
                fieldData: item.fieldData,
                isDraft: item.isDraft,
                isArchived: item.isArchived,
                createdOn: item.createdOn,
                lastUpdated: item.lastUpdated
            })),
            total: data.pagination?.total || data.items.length
        });
    }
});
