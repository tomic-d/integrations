import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:collections:list',
    provider: 'webflow',
    name: 'List Collections',
    description: 'List all CMS collections for a Webflow site.',
    input: {
        site_id: { type: 'string', required: true, description: 'Site ID' }
    },
    output: {
        collections: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/sites/' + input.site_id + '/collections', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            collections: data.collections.map(collection => ({
                id: collection.id,
                name: collection.displayName,
                slug: collection.slug
            }))
        });
    }
});
