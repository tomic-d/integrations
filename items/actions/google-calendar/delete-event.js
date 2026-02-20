import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'google-calendar:delete-event',
    provider: 'google-calendar',
    name: 'Delete Event',
    description: 'Delete an event from Google Calendar.',
    input: {
        calendar_id: { type: 'string', value: 'primary', description: 'Calendar ID' },
        event_id: { type: 'string', required: true, description: 'Event ID to delete' }
    },
    output: {
        deleted: { type: 'boolean' }
    },
    execute: async function({ token, input, provider })
    {
        const response = await fetch(provider.Get('base_url') + '/calendars/' + input.calendar_id + '/events/' + input.event_id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok && response.status !== 204)
        {
            const error = await response.text();
            throw divhunt.Error(502, error);
        }

        return { deleted: true };
    }
});
