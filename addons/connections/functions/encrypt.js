import divhunt from 'divhunt';
import connections from '#connections/addon.js';

connections.Fn('encrypt', function(data)
{
    return divhunt.Encrypt(data, process.env.ENCRYPTION_KEY);
});
