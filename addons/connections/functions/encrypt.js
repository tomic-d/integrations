import crypto from 'crypto';
import connections from '#connections/addon.js';

connections.Fn('encrypt', function(data)
{
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const tag = cipher.getAuthTag();

    return iv.toString('base64') + ':' + encrypted + ':' + tag.toString('base64');
});
