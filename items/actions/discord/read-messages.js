import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'discord:read-messages',
    provider: 'discord',
    name: 'Read Messages',
    description: 'Read message history from a Discord channel.',
    input: {
        channel: { type: 'string', required: true, description: 'Channel ID' },
        limit: { type: 'number', value: 50, description: 'Number of messages to fetch (max 100)' }
    },
    output: {
        messages: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const params = new URLSearchParams({ limit: input.limit });

        const response = await fetch(provider.Get('base_url') + '/channels/' + input.channel + '/messages?' + params, {
            headers: { 'Authorization': 'Bot ' + token }
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            messages: data.map(message => ({
                id: message.id,
                content: message.content,
                author: message.author.username,
                timestamp: message.timestamp
            }))
        });
    }
});
