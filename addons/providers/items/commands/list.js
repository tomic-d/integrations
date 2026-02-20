import commands from 'divhunt/commands';
import providers from '#providers/addon.js';

commands.Item({
    id: 'providers:list',
    exposed: true,
    method: 'GET',
    endpoint: '/providers',
    out: {
        providers: {
            type: 'array',
            each: {
                type: 'object'
            }
        }
    },
    callback: async function(properties, resolve)
    {
        const items = Object.values(providers.Items());

        resolve({
            providers: items
                .filter(item => item.Get('status') === 'active')
                .map(item => item.Get(['id', 'name', 'slug', 'description', 'icon', 'auth_type', 'base_url', 'status']))
        });
    }
});
