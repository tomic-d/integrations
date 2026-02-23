import commands from 'onetype/commands';
import connections from '#connections/addon.js';

commands.Item({
    id: 'connections:status',
    exposed: true,
    in: {
        id: ['string', null, true]
    },
    out: {
        status: ['string', null, true],
        valid: ['boolean', null, true]
    },
    callback: async function(properties, resolve)
    {
        const connection = await connections.Find().filter('id', properties.id).one();

        if(!connection)
        {
            return resolve(null, 'Connection not found.', 404);
        }

        const status = connection.Get('status');
        let valid = status === 'active';

        if(valid && connection.Get('expires_at'))
        {
            const expiresAt = new Date(connection.Get('expires_at'));

            if(expiresAt < new Date())
            {
                try
                {
                    await connections.Fn('refresh', connection);
                    valid = true;
                }
                catch(error)
                {
                    valid = false;
                }
            }
        }

        resolve({
            status: connection.Get('status'),
            valid
        });
    }
});
