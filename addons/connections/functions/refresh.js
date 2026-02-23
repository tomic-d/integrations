import onetype from 'onetype';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

connections.Fn('refresh', function(connection)
{
    this.methods.init = async (resolve) =>
    {
        this.resolve = resolve;

        const provider = providers.ItemGet(connection.Get('provider_id'));
        const oauth2 = provider.Get('oauth2');
        const credentials = connections.Fn('decrypt', connection.Get('credentials'));

        this.methods.validate(credentials);

        const data = await this.methods.exchange(oauth2, credentials);
        const updated = this.methods.save(data, credentials);

        this.resolve(updated);
    };

    this.methods.validate = (credentials) =>
    {
        if(!credentials.refresh_token)
        {
            connection.Set('status', 'expired');
            connection.Update();

            throw onetype.Error(400, 'No refresh token. Re-authorization required.');
        }
    };

    this.methods.exchange = async (oauth2, credentials) =>
    {
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

        if(oauth2.token_headers)
        {
            Object.assign(headers, oauth2.token_headers);
        }

        const response = await fetch(oauth2.token_url, {
            method: 'POST',
            headers,
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: credentials.refresh_token,
                client_id: process.env[oauth2.client_id_env],
                client_secret: process.env[oauth2.client_secret_env]
            })
        });

        if(!response.ok)
        {
            connection.Set('status', 'error');
            await connection.Update();

            throw onetype.Error(502, 'Token refresh failed.');
        }

        return await response.json();
    };

    this.methods.save = (data, credentials) =>
    {
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

        connection.Update();

        return updated;
    };

    return new Promise((resolve) =>
    {
        this.methods.init(resolve);
    });
});
