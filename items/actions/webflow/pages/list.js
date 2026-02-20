import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:pages:list',
    provider: 'webflow',
    name: 'List Pages',
    description: 'List all pages for a Webflow site.',
    input: {
        site_id: { type: 'string', required: true, description: 'Site ID' }
    },
    output: {
        pages: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/sites/' + input.site_id + '/pages', {
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
            pages: data.pages.map(page => ({
                id: page.id,
                title: page.title,
                slug: page.slug,
                archived: page.archived,
                draft: page.draft
            }))
        });
    }
});
