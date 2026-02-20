import actions from '#actions/addon.js';

actions.Item({
    id: 'slack:list-channels',
    provider_id: 'slack',
    name: 'List Channels',
    description: 'List all channels in a Slack workspace.',
    input: {
        limit: { type: 'number', value: 100, description: 'Max channels to return' }
    },
    output: {
        channels: { type: 'array' }
    },
    execute: async function({ token, input, base_url })
    {
        const params = new URLSearchParams({ limit: input.limit });

        const response = await fetch(base_url + '/conversations.list?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await response.json();

        if(!data.ok)
        {
            throw new Error('Slack error: ' + (data.error || 'Unknown'));
        }

        return {
            channels: data.channels.map(c => ({
                id: c.id,
                name: c.name,
                topic: c.topic?.value || '',
                members: c.num_members
            }))
        };
    }
});
