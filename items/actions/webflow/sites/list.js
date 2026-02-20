import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'webflow:sites:list',
    provider: 'webflow',
    name: 'List Sites',
    description: 'List all Webflow sites.',
    input: {},
    output: {
        sites: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/sites', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            sites: data.sites.map(site => ({
                id: site.id,
                name: site.displayName,
                shortName: site.shortName,
                previewUrl: site.previewUrl
            }))
        });
    }
});
