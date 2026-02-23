import onetype from 'onetype';
import connections from '#connections/addon.js';

connections.Fn('encrypt', function(data)
{
    return onetype.Encrypt(data, process.env.ENCRYPTION_KEY);
});
