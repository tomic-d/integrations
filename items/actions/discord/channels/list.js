import onetype from 'onetype';
import actions from '#actions/addon.js';

actions.Item({
    id: 'discord:channels:list',
    provider: 'discord',
    name: 'List Channels',
    description: 'List all channels in a Discord guild.',
    input: {
        guild: { type: 'string', required: true, description: 'Guild ID' }
    },
    output: {
        channels: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/guilds/' + input.guild + '/channels', {
            headers: { 'Authorization': 'Bot ' + token }
        });

        if(!response.ok)
        {
            throw onetype.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            channels: data
                .filter(channel => channel.type === 0)
                .map(channel => ({
                    id: channel.id,
                    name: channel.name,
                    topic: channel.topic,
                    position: channel.position
                }))
        });
    }
});
