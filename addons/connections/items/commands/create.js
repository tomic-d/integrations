import crypto from 'crypto';
import divhunt from 'divhunt';
import commands from 'divhunt/commands';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

commands.Item({
    id: 'connections:create',
    exposed: true,
    method: 'POST',
    endpoint: '/connections/create',
    in: {
        team_id: ['string', null, true],
        provider_id: ['string', null, true],
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
        const provider = providers.ItemGet(properties.provider_id);

        if(!provider)
        {
            return resolve(null, 'Provider not found.', 404);
        }

        if(provider.Get('status') !== 'active')
        {
            return resolve(null, 'Provider is not active.', 400);
        }

        const auth = provider.Get('auth');
        const authType = auth.type;
        const config = auth.config;

        if(authType === 'oauth2')
        {
            const nonce = crypto.randomBytes(16).toString('hex');
            const state = properties.provider_id + ':' + properties.team_id + ':' + nonce;

            const params = new URLSearchParams({
                client_id: process.env[config.client_id_env],
                redirect_uri: process.env.OAUTH_REDIRECT_URI,
                scope: config.scopes,
                state,
                response_type: 'code'
            });

            if(config.extra_params)
            {
                for(const [key, value] of Object.entries(config.extra_params))
                {
                    params.set(key, value);
                }
            }

            return resolve({
                authorize_url: config.authorize_url + '?' + params.toString()
            });
        }

        if(authType === 'api_key' || authType === 'pat')
        {
            if(!properties.credentials || !properties.credentials.token)
            {
                return resolve(null, 'Credentials with token field required.', 400);
            }

            const connection = connections.Item({
                team_id: properties.team_id,
                provider_id: properties.provider_id,
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
