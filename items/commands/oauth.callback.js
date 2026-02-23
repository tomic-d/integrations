import commands from 'onetype/commands';
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
        connection: {
            type: 'object',
            config: 'connection'
        }
    },
    callback: async function(properties, resolve)
    {
        const connection = await connections.Fn('callback', properties.code, properties.state);

        resolve({
            connection: connection.Get(['id', 'team_id', 'provider_id', 'status', 'metadata', 'scopes', 'expires_at', 'updated_at', 'created_at'])
        });
    }
});
