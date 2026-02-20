import actions from '#actions/addon.js';

actions.Item({
    id: 'calendly:list-events',
    provider_id: 'calendly',
    name: 'List Events',
    description: 'List scheduled Calendly events.',
    input: {
        count: { type: 'number', value: 20, description: 'Max events to return' },
        status: { type: 'string', value: 'active', description: 'Event status: active or canceled' }
    },
    output: {
        events: { type: 'array' }
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
            count: input.count,
            status: input.status
        });

        const response = await fetch(base_url + '/scheduled_events?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw new Error('Calendly error: ' + error);
        }

        const data = await response.json();

        return {
            events: data.collection.map(e => ({
                uri: e.uri,
                name: e.name,
                status: e.status,
                start_time: e.start_time,
                end_time: e.end_time,
                location: e.location?.location || ''
            }))
        };
    }
});
