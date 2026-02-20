import commands from 'divhunt/commands';
import connections from '#connections/addon.js';

commands.Item({
    id: 'connections:get:many',
    exposed: true,
    method: 'GET',
    endpoint: '/connections',
    in: 'query',
    out: {
        connections: {
            type: 'array',
            each: {
                type: 'object',
                config: 'connection'
            }
        },
        total: ['number', null, true],
        page: ['number', null, true],
        limit: ['number', null, true]
    },
    callback: async function(properties, resolve)
    {
        let query = connections.Find();

        if(properties.filters)
        {
            properties.filters.forEach(filter =>
            {
                query = query.filter(filter.field, filter.value, filter.operator || 'EQUALS');
            });
        }

        if(properties.sort_field)
        {
            query = query.sort(properties.sort_field, properties.sort_direction || 'asc');
        }

        const total = await query.count();

        const items = await query
            .page(properties.page || 0)
            .limit(properties.limit || 10)
            .many();

        resolve({
            connections: items.map(item => item.Get(['id', 'team_id', 'provider_id', 'status', 'metadata', 'scopes', 'expires_at', 'updated_at', 'created_at'])),
            total,
            page: properties.page || 0,
            limit: properties.limit || 10
        });
    }
});
