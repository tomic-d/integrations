import actions from '#actions/addon.js';

actions.Item({
    id: 'slack:create-channel',
    provider_id: 'slack',
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
    execute: async function({ token, input, base_url })
    {
        const response = await fetch(base_url + '/conversations.create', {
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
            throw new Error('Slack error: ' + (data.error || 'Unknown'));
        }

        return { id: data.channel.id, name: data.channel.name };
    }
});
