import divhunt from 'divhunt';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

connections.Fn('refresh', async function(connection)
{
    const provider = providers.ItemGet(connection.Get('provider_id'));
    const config = provider.Get('auth').config;
    const credentials = connections.Fn('decrypt', connection.Get('credentials'));

    if(!credentials.refresh_token)
    {
        connection.Set('status', 'expired');
        await connection.Update();

        throw divhunt.Error(400, 'No refresh token. Re-authorization required.');
    }

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
            grant_type: 'refresh_token',
            refresh_token: credentials.refresh_token,
            client_id: clientId,
            client_secret: clientSecret
        })
    });

    if(!response.ok)
    {
        connection.Set('status', 'error');
        await connection.Update();

        throw divhunt.Error(502, 'Token refresh failed.');
    }

    const data = await response.json();

    const updated = {
        access_token: data.access_token,
        refresh_token: data.refresh_token || credentials.refresh_token,
        token_type: data.token_type || 'Bearer'
    };

    connection.Set('credentials', connections.Fn('encrypt', updated));
    connection.Set('status', 'active');

    if(data.expires_in)
    {
        connection.Set('expires_at', new Date(Date.now() + data.expires_in * 1000).toISOString());
    }

    await connection.Update();

    return updated;
});
