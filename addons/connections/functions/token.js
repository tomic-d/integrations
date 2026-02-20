import divhunt from 'divhunt';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

connections.Fn('token', function(id)
{
    this.methods.init = async (resolve) =>
    {
        this.resolve = resolve;

        const connection = await this.methods.connection(id);
        const provider = this.methods.provider(connection);
        const credentials = connections.Fn('decrypt', connection.Get('credentials'));
        const authType = provider.Get('auth_type');

        if(authType === 'api_key')
        {
            return this.resolve(credentials.token);
        }

        this.resolve(await this.methods.oauth(connection, credentials));
    };

    this.methods.connection = async (id) =>
    {
        const connection = await connections.Find().filter('id', id).one();

        if(!connection)
        {
            throw divhunt.Error(404, 'Connection not found.');
        }

        if(connection.Get('status') !== 'active')
        {
            throw divhunt.Error(400, 'Connection is not active.');
        }

        return connection;
    };

    this.methods.provider = (connection) =>
    {
        const provider = providers.ItemGet(connection.Get('provider_id'));

        if(!provider)
        {
            throw divhunt.Error(404, 'Provider not found.');
        }

        return provider;
    };

    this.methods.oauth = async (connection, credentials) =>
    {
        const expiresAt = connection.Get('expires_at');

        if(expiresAt)
        {
            const buffer = 5 * 60 * 1000;

            if(new Date(expiresAt).getTime() - buffer < Date.now())
            {
                const refreshed = await connections.Fn('refresh', connection);
                return refreshed.access_token;
            }
        }

        return credentials.access_token;
    };

    return new Promise((resolve) =>
    {
        this.methods.init(resolve);
    });
});
