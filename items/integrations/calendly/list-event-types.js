import actions from '#actions/addon.js';

actions.Item({
    id: 'calendly:list-event-types',
    provider_id: 'calendly',
    name: 'List Event Types',
    description: 'List available Calendly event types.',
    input: {
        count: { type: 'number', value: 20, description: 'Max event types to return' }
    },
    output: {
        event_types: { type: 'array' }
    },
    execute: async function({ token, input, base_url })
    {
        const user = await fetch(base_url + '/users/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!user.ok)
        {
            throw new Error('Calendly error: failed to get user');
        }

        const userData = await user.json();

        const params = new URLSearchParams({
            user: userData.resource.uri,
            count: input.count
        });

        const response = await fetch(base_url + '/event_types?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw new Error('Calendly error: ' + error);
        }

        const data = await response.json();

        return {
            event_types: data.collection.map(e => ({
                uri: e.uri,
                name: e.name,
                slug: e.slug,
                duration: e.duration,
                active: e.active,
                scheduling_url: e.scheduling_url
            }))
        };
    }
});
