import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:pages:update',
    provider: 'webflow',
    name: 'Update Page',
    description: 'Update page title, slug, SEO, and Open Graph settings.',
    input: {
        page_id: { type: 'string', required: true, description: 'Page ID' },
        title: { type: 'string', description: 'Page title' },
        slug: { type: 'string', description: 'Page slug' },
        seo: { type: 'object', description: 'SEO settings (title, description)' },
        open_graph: { type: 'object', description: 'Open Graph settings (title, description)' }
    },
    output: {
        id: { type: 'string' },
        title: { type: 'string' },
        slug: { type: 'string' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const body = {};

        if(input.title) body.title = input.title;
        if(input.slug) body.slug = input.slug;
        if(input.seo) body.seo = input.seo;
        if(input.open_graph) body.openGraph = input.open_graph;

        const response = await fetch(provider.Get('base_url') + '/pages/' + input.page_id, {
            method: 'PUT',
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
            title: data.title,
            slug: data.slug
        });
    }
});
