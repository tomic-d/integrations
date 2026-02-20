import divhunt from 'divhunt';
import connections from '#connections/addon.js';

connections.Fn('revoke', async function(connectionId)
{
    const connection = await connections.Find().filter('id', connectionId).one();

    if(!connection)
    {
        throw divhunt.Error(404, 'Connection not found.');
    }

    connection.Set('status', 'revoked');
    connection.Set('credentials', connections.Fn('encrypt', {}));
    connection.Set('deleted_at', new Date().toISOString());

    await connection.Update();

    return true;
});
