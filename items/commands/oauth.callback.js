import commands from 'divhunt/commands';
import connections from '#connections/addon.js';

commands.Item({
    id: 'oauth:callback',
    exposed: true,
    method: 'GET',
    endpoint: '/oauth/callback',
    in: {
        code: ['string', null, true],
        state: ['string', null, true]
    },
    out: {
        success: ['boolean', null, true]
    },
    callback: async function(properties, resolve)
    {
        await connections.Fn('callback', properties.code, properties.state);

        resolve({ success: true });
    }
});
