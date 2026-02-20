import actions from '#actions/addon.js';

actions.Item({
    id: 'google-calendar:delete-event',
    provider_id: 'google-calendar',
    name: 'Delete Event',
    description: 'Delete an event from Google Calendar.',
    input: {
        calendar_id: { type: 'string', value: 'primary', description: 'Calendar ID' },
        event_id: { type: 'string', required: true, description: 'Event ID to delete' }
    },
    output: {
        deleted: { type: 'boolean' }
    },
    execute: async function({ token, input, base_url })
    {
        const response = await fetch(base_url + '/calendars/' + input.calendar_id + '/events/' + input.event_id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok && response.status !== 204)
        {
            const error = await response.text();
            throw new Error('Google Calendar error: ' + error);
        }

        return { deleted: true };
    }
});
