import crypto from 'crypto';
import connections from '#connections/addon.js';

connections.Fn('decrypt', function(ciphertext)
{
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const [ivB64, encryptedB64, tagB64] = ciphertext.split(':');

    const iv = Buffer.from(ivB64, 'base64');
    const encrypted = Buffer.from(encryptedB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
});
