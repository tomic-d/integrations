import commands from 'divhunt/commands';
import connections from '#connections/addon.js';

commands.Item({
    id: 'connections:unlink',
    exposed: true,
    in: {
        id: ['string', null, true]
    },
    out: {
        connection: {
            type: 'object',
            config: 'connection'
        }
    },
    callback: async function(properties, resolve)
    {
        const connection = await connections.Find().filter('id', properties.id).one();

        if(!connection)
        {
            return resolve(null, 'Connection not found.', 404);
        }

        connection.Set('status', 'revoked');
        connection.Set('credentials', connections.Fn('encrypt', {}));
        connection.Set('deleted_at', new Date().toISOString());

        await connection.Update();

        resolve({
            connection: connection.Get(['id', 'team_id', 'provider_id', 'status', 'metadata', 'scopes', 'expires_at', 'updated_at', 'created_at'])
        });
    }
});
