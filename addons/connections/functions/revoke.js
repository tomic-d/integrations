import onetype from 'onetype';
import connections from '#connections/addon.js';

connections.Fn('revoke', async function(id)
{
    const connection = await connections.Find().filter('id', id).one();

    if(!connection)
    {
        throw onetype.Error(404, 'Connection not found.');
    }

    connection.Set('status', 'revoked');
    connection.Set('credentials', connections.Fn('encrypt', {}));
    connection.Set('deleted_at', new Date().toISOString());

    await connection.Update();

    return true;
});
