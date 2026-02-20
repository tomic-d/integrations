import commands from 'divhunt/commands';
import actions from '#actions/addon.js';

commands.Item({
    id: 'actions:list',
    exposed: true,
    method: 'GET',
    endpoint: '/actions',
    in: {
        provider_id: ['string']
    },
    out: {
        actions: {
            type: 'array',
            each: {
                type: 'object'
            }
        }
    },
    callback: async function(properties, resolve)
    {
        let items = Object.values(actions.Items());

        if(properties.provider_id)
        {
            items = items.filter(item => item.Get('provider_id') === properties.provider_id);
        }

        resolve({
            actions: items.map(item => item.Get(['id', 'provider_id', 'name', 'description', 'input', 'output']))
        });
    }
});
