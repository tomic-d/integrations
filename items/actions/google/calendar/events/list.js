import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'google:calendar:events:list',
    provider: 'google:calendar',
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
    execute: async function({ token, input, provider }, resolve)
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

        const response = await fetch(provider.Get('base_url') + '/calendars/' + input.calendar_id + '/events?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            events: (data.items || []).map(event => ({
                id: event.id,
                summary: event.summary || '',
                start: event.start?.dateTime || event.start?.date || '',
                end: event.end?.dateTime || event.end?.date || '',
                location: event.location || '',
                url: event.htmlLink || ''
            }))
        });
    }
});
