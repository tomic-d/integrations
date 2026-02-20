import actions from '#actions/addon.js';

actions.Item({
    id: 'google-calendar:list-events',
    provider_id: 'google-calendar',
    name: 'List Events',
    description: 'List upcoming events from Google Calendar.',
    input: {
        calendar_id: { type: 'string', value: 'primary', description: 'Calendar ID' },
        max_results: { type: 'number', value: 10, description: 'Max events to return' },
        time_min: { type: 'string', description: 'Start of time range (ISO 8601)' }
    },
    output: {
        events: { type: 'array' }
    },
    execute: async function({ token, input, base_url })
    {
        const params = new URLSearchParams({
            maxResults: input.max_results,
            singleEvents: true,
            orderBy: 'startTime'
        });

        if(input.time_min)
        {
            params.set('timeMin', input.time_min);
        }
        else
        {
            params.set('timeMin', new Date().toISOString());
        }

        const response = await fetch(base_url + '/calendars/' + input.calendar_id + '/events?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw new Error('Google Calendar error: ' + error);
        }

        const data = await response.json();

        return {
            events: (data.items || []).map(e => ({
                id: e.id,
                summary: e.summary || '',
                start: e.start?.dateTime || e.start?.date || '',
                end: e.end?.dateTime || e.end?.date || '',
                location: e.location || '',
                url: e.htmlLink || ''
            }))
        };
    }
});
