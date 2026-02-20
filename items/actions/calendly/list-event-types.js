import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'calendly:list-event-types',
    provider: 'calendly',
    name: 'List Event Types',
    description: 'List available Calendly event types.',
    input: {
        count: { type: 'number', value: 20, description: 'Max event types to return' }
    },
    output: {
        event_types: { type: 'array' }
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
            count: input.count
        });

        const result = await fetch(provider.Get('base_url') + '/event_types?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!result.ok)
        {
            const error = await result.text();
            throw divhunt.Error(502, error);
        }

        const data = await result.json();

        resolve({
            event_types: data.collection.map(type => ({
                uri: type.uri,
                name: type.name,
                slug: type.slug,
                duration: type.duration,
                active: type.active,
                scheduling_url: type.scheduling_url
            }))
        });
    }
});
