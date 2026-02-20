import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'discord:guilds:list',
    provider: 'discord',
    name: 'List Guilds',
    description: 'List all guilds the bot is in.',
    input: {},
    output: {
        guilds: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/users/@me/guilds', {
            headers: { 'Authorization': 'Bot ' + token }
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({
            guilds: data.map(guild => ({
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                owner: guild.owner
            }))
        });
    }
});
