import divhunt from 'divhunt';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

connections.Fn('callback', async function(code, state)
{
    const parts = state.split(':');
    const providerId = parts[0];
    const teamId = parts[1];

    if(!providerId || !teamId)
    {
        throw divhunt.Error(400, 'Invalid state parameter.');
    }

    const provider = providers.ItemGet(providerId);

    if(!provider)
    {
        throw divhunt.Error(404, 'Provider not found.');
    }

    const config = provider.Get('auth_config');
    const clientId = process.env[config.client_id_env];
    const clientSecret = process.env[config.client_secret_env];

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    if(config.token_headers)
    {
        Object.assign(headers, config.token_headers);
    }

    const response = await fetch(config.token_url, {
        method: 'POST',
        headers,
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: process.env.OAUTH_REDIRECT_URI
        })
    });

    if(!response.ok)
    {
        const error = await response.text();
        throw divhunt.Error(502, 'Token exchange failed: ' + error);
    }

    const data = await response.json();
    const parsed = provider.Get('callback')(data);

    const connection = connections.Item({
        team_id: teamId,
        provider_id: providerId,
        status: 'active',
        credentials: connections.Fn('encrypt', parsed.credentials),
        metadata: parsed.metadata,
        scopes: parsed.scopes || config.scopes || '',
        expires_at: parsed.expires_at
    });

    await connection.Create();

    return connection;
});
