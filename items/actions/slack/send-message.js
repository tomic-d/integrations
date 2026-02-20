import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'slack:send-message',
    provider: 'slack',
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
    execute: async function({ token, input, provider })
    {
        const response = await fetch(provider.Get('base_url') + '/chat.postMessage', {
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
            throw divhunt.Error(502, data.error || 'Unknown Slack error.');
        }

        return { ok: data.ok, ts: data.ts };
    }
});
