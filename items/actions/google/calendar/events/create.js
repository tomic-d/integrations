import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'google:calendar:events:create',
    provider: 'google:calendar',
    name: 'Create Event',
    description: 'Create a new event in Google Calendar.',
    input: {
        summary: { type: 'string', required: true, description: 'Event title' },
        start: { type: 'string', required: true, description: 'Start time (ISO 8601)' },
        end: { type: 'string', required: true, description: 'End time (ISO 8601)' },
        description: { type: 'string', description: 'Event description' },
        location: { type: 'string', description: 'Event location' },
        calendar_id: { type: 'string', value: 'primary', description: 'Calendar ID' }
    },
    output: {
        id: { type: 'string' },
        url: { type: 'string' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/calendars/' + input.calendar_id + '/events', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                summary: input.summary,
                description: input.description || '',
                location: input.location || '',
                start: { dateTime: input.start },
                end: { dateTime: input.end }
            })
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({ id: data.id, url: data.htmlLink });
    }
});
