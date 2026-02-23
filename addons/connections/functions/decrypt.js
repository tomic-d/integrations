import onetype from 'onetype';
import connections from '#connections/addon.js';

connections.Fn('decrypt', function(ciphertext)
{
    return onetype.Decrypt(ciphertext, process.env.ENCRYPTION_KEY);
});
