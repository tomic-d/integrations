import crypto from 'crypto';
import divhunt from 'divhunt';
import commands from 'divhunt/commands';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

commands.Item({
    id: 'connections:link',
    exposed: true,
    method: 'POST',
    endpoint: '/connections/link',
    in: {
        team: ['string', null, true],
        provider: ['string', null, true],
        credentials: ['object']
    },
    out: {
        authorize_url: ['string'],
        connection: {
            type: 'object',
            config: 'connection'
        }
    },
    callback: async function(properties, resolve)
    {
        const provider = providers.ItemGet(properties.provider);

        if(!provider)
        {
            return resolve(null, 'Provider not found.', 404);
        }

        const authType = provider.Get('auth_type');

        if(authType === 'oauth2')
        {
            const oauth2 = provider.Get('oauth2');
            const nonce = crypto.randomBytes(16).toString('hex');
            const state = properties.provider + ':' + properties.team + ':' + nonce;

            const params = new URLSearchParams({
                client_id: process.env[oauth2.client_id_env],
                redirect_uri: process.env.OAUTH_REDIRECT_URI,
                scope: oauth2.scopes,
                state,
                response_type: 'code'
            });

            if(oauth2.authorize_params)
            {
                for(const [key, value] of Object.entries(oauth2.authorize_params))
                {
                    params.set(key, value);
                }
            }

            return resolve({
                authorize_url: oauth2.authorize_url + '?' + params.toString()
            });
        }

        if(authType === 'api_key')
        {
            if(!properties.credentials || !properties.credentials.token)
            {
                return resolve(null, 'Credentials with token field required.', 400);
            }

            const connection = connections.Item({
                team_id: properties.team,
                provider_id: properties.provider,
                status: 'active',
                credentials: connections.Fn('encrypt', properties.credentials),
                metadata: {},
                scopes: ''
            });

            await connection.Create();

            return resolve({
                connection: connection.Get(['id', 'team_id', 'provider_id', 'status', 'metadata', 'scopes', 'expires_at', 'updated_at', 'created_at'])
            });
        }

        return resolve(null, 'Unsupported auth type.', 400);
    }
});
