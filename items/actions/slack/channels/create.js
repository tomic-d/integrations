import onetype from 'onetype';
import actions from '#actions/addon.js';

actions.Item({
    id: 'slack:channels:create',
    provider: 'slack',
    name: 'Create Channel',
    description: 'Create a new Slack channel.',
    input: {
        name: { type: 'string', required: true, description: 'Channel name' },
        is_private: { type: 'boolean', value: false, description: 'Whether the channel is private' }
    },
    output: {
        id: { type: 'string' },
        name: { type: 'string' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/conversations.create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                name: input.name,
                is_private: input.is_private
            })
        });

        const data = await response.json();

        if(!data.ok)
        {
            throw onetype.Error(502, data.error || 'Unknown Slack error.');
        }

        resolve({ id: data.channel.id, name: data.channel.name });
    }
});
