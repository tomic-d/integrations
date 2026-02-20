import actions from '#actions/addon.js';

actions.Item({
    id: 'slack:send-message',
    provider_id: 'slack',
    name: 'Send Message',
    description: 'Send a message to a Slack channel.',
    input: {
        channel: { type: 'string', required: true, description: 'Channel ID' },
        text: { type: 'string', required: true, description: 'Message text' }
    },
    output: {
        ok: { type: 'boolean' },
        ts: { type: 'string' }
    },
    execute: async function({ token, input, base_url })
    {
        const response = await fetch(base_url + '/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                channel: input.channel,
                text: input.text
            })
        });

        const data = await response.json();

        if(!data.ok)
        {
            throw new Error('Slack error: ' + (data.error || 'Unknown'));
        }

        return { ok: data.ok, ts: data.ts };
    }
});
