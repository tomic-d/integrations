import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'google-gmail:send-email',
    provider: 'google-gmail',
    name: 'Send Email',
    description: 'Send an email via Gmail.',
    input: {
        to: { type: 'string', required: true, description: 'Recipient email' },
        subject: { type: 'string', required: true, description: 'Email subject' },
        body: { type: 'string', required: true, description: 'Email body (plain text)' }
    },
    output: {
        id: { type: 'string' },
        thread_id: { type: 'string' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const message = [
            'To: ' + input.to,
            'Subject: ' + input.subject,
            'Content-Type: text/plain; charset=utf-8',
            '',
            input.body
        ].join('\r\n');

        const encoded = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const response = await fetch(provider.Get('base_url') + '/users/me/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ raw: encoded })
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw divhunt.Error(502, error);
        }

        const data = await response.json();

        resolve({ id: data.id, thread_id: data.threadId });
    }
});
