import onetype from 'onetype';
import actions from '#actions/addon.js';

actions.Item({
    id: 'discord:messages:send',
    provider: 'discord',
    name: 'Send Message',
    description: 'Send a message to a Discord channel.',
    input: {
        channel: { type: 'string', required: true, description: 'Channel ID' },
        content: { type: 'string', required: true, description: 'Message content' }
    },
    output: {
        id: { type: 'string' },
        channel_id: { type: 'string' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/channels/' + input.channel + '/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bot ' + token
            },
            body: JSON.stringify({ content: input.content })
        });

        if(!response.ok)
        {
            throw onetype.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({ id: data.id, channel_id: data.channel_id });
    }
});
