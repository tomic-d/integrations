import divhunt from 'divhunt';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

connections.Fn('token', async function(id)
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

    const provider = providers.ItemGet(connection.Get('provider_id'));

    if(!provider)
    {
        throw divhunt.Error(404, 'Provider not found.');
    }

    const credentials = connections.Fn('decrypt', connection.Get('credentials'));
    const authType = provider.Get('auth').type;

    if(authType === 'api_key' || authType === 'pat')
    {
        return credentials.token;
    }

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
});
