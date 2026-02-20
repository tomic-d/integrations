import divhunt from 'divhunt';
import connections from '#connections/addon.js';

connections.Fn('decrypt', function(ciphertext)
{
    return divhunt.Decrypt(ciphertext, process.env.ENCRYPTION_KEY);
});
