import commands from 'divhunt/commands';
import actions from '#actions/addon.js';

commands.Item({
    id: 'actions:list',
    exposed: true,
    in: {
        provider: ['string']
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

        if(properties.provider)
        {
            items = items.filter(item => item.Get('provider') === properties.provider);
        }

        resolve({
            actions: items.map(item => item.Get(['id', 'provider', 'name', 'description', 'input', 'output']))
        });
    }
});
