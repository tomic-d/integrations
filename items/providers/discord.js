import providers from '#providers/addon.js';

providers.Item({
    id: 'discord',
    name: 'Discord',
    slug: 'discord',
    description: 'Communication platform for communities.',
    icon: 'discord',
    auth_type: 'oauth2',
    oauth2: {
        authorize_url: 'https://discord.com/api/oauth2/authorize',
        token_url: 'https://discord.com/api/oauth2/token',
        scopes: 'bot',
        client_id_env: 'DISCORD_CLIENT_ID',
        client_secret_env: 'DISCORD_CLIENT_SECRET',
        authorize_params: {
            permissions: '68624'
        },
        callback: function(data)
        {
            return {
                access_token: process.env.DISCORD_BOT_TOKEN,
                refresh_token: null,
                token_type: 'Bot',
                expires_at: null,
                scopes: data.scope,
                metadata: {
                    guild: {
                        id: data.guild.id,
                        name: data.guild.name
                    }
                }
            };
        }
    },
    base_url: 'https://discord.com/api/v10'
});
