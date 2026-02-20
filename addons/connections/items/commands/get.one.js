import commands from 'divhunt/commands';
import connections from '#connections/addon.js';

commands.Item({
    id: 'connections:get:one',
    exposed: true,
    method: 'GET',
    endpoint: '/connections/one',
    in: {
        id: ['string'],
        filters: {
            type: 'array',
            each: {
                type: 'object',
                config: 'filter'
            }
        }
    },
    out: {
        connection: {
            type: 'object',
            config: 'connection',
            required: true
        }
    },
    callback: async function(properties, resolve)
    {
        let query = connections.Find();

        if(properties.id)
        {
            query = query.filter('id', properties.id);
        }

        if(properties.filters)
        {
            properties.filters.forEach(filter =>
            {
                query = query.filter(filter.field, filter.value, filter.operator || 'EQUALS');
            });
        }

        const connection = await query.one();

        if(!connection)
        {
            return resolve(null, 'Connection not found.', 404);
        }

        resolve({
            connection: connection.Get(['id', 'team_id', 'provider_id', 'status', 'metadata', 'scopes', 'expires_at', 'updated_at', 'created_at'])
        });
    }
});
