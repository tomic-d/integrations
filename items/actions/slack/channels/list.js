import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'slack:channels:list',
    provider: 'slack',
    name: 'List Channels',
    description: 'List all channels in a Slack workspace.',
    input: {
        limit: { type: 'number', value: 100, description: 'Max channels to return' }
    },
    output: {
        channels: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const params = new URLSearchParams({ limit: input.limit });

        const response = await fetch(provider.Get('base_url') + '/conversations.list?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await response.json();

        if(!data.ok)
        {
            throw divhunt.Error(502, data.error || 'Unknown Slack error.');
        }

        resolve({
            channels: data.channels.map(channel => ({
                id: channel.id,
                name: channel.name,
                topic: channel.topic?.value || '',
                members: channel.num_members
            }))
        });
    }
});
