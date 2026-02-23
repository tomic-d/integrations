import fs from 'fs';
import path from 'path';
import onetype from 'onetype';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

connections.Fn('callback', function(code, state)
{
    this.methods.init = async (resolve) =>
    {
        this.resolve = resolve;

        const { providerId, teamId } = this.methods.parse(state);
        const provider = this.methods.provider(providerId);
        const data = await this.methods.exchange(code, provider);
        this.methods.debug(providerId, data);
        const parsed = provider.Get('oauth2').callback(data);
        const connection = await this.methods.save(teamId, providerId, provider, parsed);

        this.resolve(connection);
    };

    this.methods.parse = (state) =>
    {
        const parts = state.split(':');
        const providerId = parts[0];
        const teamId = parts[1];

        if(!providerId || !teamId)
        {
            throw onetype.Error(400, 'Invalid state parameter.');
        }

        return { providerId, teamId };
    };

    this.methods.provider = (id) =>
    {
        const provider = providers.ItemGet(id);

        if(!provider)
        {
            throw onetype.Error(404, 'Provider not found.');
        }

        return provider;
    };

    this.methods.exchange = async (code, provider) =>
    {
        const oauth2 = provider.Get('oauth2');
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

        if(oauth2.token_headers)
        {
            Object.assign(headers, oauth2.token_headers);
        }

        const response = await fetch(oauth2.token_url, {
            method: 'POST',
            headers,
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: process.env[oauth2.client_id_env],
                client_secret: process.env[oauth2.client_secret_env],
                redirect_uri: process.env.OAUTH_REDIRECT_URI
            })
        });

        if(!response.ok)
        {
            throw onetype.Error(502, 'Token exchange failed: ' + await response.text());
        }

        return await response.json();
    };

    this.methods.save = async (teamId, providerId, provider, parsed) =>
    {
        const oauth2 = provider.Get('oauth2');

        const connection = connections.Item({
            team_id: teamId,
            provider_id: providerId,
            status: 'active',
            credentials: connections.Fn('encrypt', {
                access_token: parsed.access_token,
                refresh_token: parsed.refresh_token,
                token_type: parsed.token_type
            }),
            metadata: parsed.metadata,
            scopes: parsed.scopes || oauth2.scopes || '',
            expires_at: parsed.expires_at
        });

        await connection.Create();

        return connection;
    };

    this.methods.debug = (providerId, data) =>
    {
        const dir = path.resolve('debug/providers');
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, providerId + '.json'), JSON.stringify(data, null, 4));
    };

    return new Promise((resolve) =>
    {
        this.methods.init(resolve);
    });
});
