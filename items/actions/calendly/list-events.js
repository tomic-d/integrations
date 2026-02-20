import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'calendly:list-events',
    provider: 'calendly',
    name: 'List Events',
    description: 'List scheduled Calendly events.',
    input: {
        count: { type: 'number', value: 20, description: 'Max events to return' },
        status: { type: 'string', value: 'active', description: 'Event status: active or canceled' }
    },
    output: {
        events: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/users/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw divhunt.Error(502, error);
        }

        const userData = await response.json();

        const params = new URLSearchParams({
            user: userData.resource.uri,
            count: input.count,
            status: input.status
        });

        const result = await fetch(provider.Get('base_url') + '/scheduled_events?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!result.ok)
        {
            const error = await result.text();
            throw divhunt.Error(502, error);
        }

        const data = await result.json();

        resolve({
            events: data.collection.map(event => ({
                uri: event.uri,
                name: event.name,
                status: event.status,
                start_time: event.start_time,
                end_time: event.end_time,
                location: event.location?.location || ''
            }))
        });
    }
});
