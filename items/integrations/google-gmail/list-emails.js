import actions from '#actions/addon.js';

actions.Item({
    id: 'google-gmail:list-emails',
    provider_id: 'google-gmail',
    name: 'List Emails',
    description: 'List emails from Gmail inbox.',
    input: {
        max_results: { type: 'number', value: 10, description: 'Max emails to return' },
        label: { type: 'string', value: 'INBOX', description: 'Label to filter by' }
    },
    output: {
        messages: { type: 'array' }
    },
    execute: async function({ token, input, base_url })
    {
        const params = new URLSearchParams({
            maxResults: input.max_results,
            labelIds: input.label
        });

        const response = await fetch(base_url + '/users/me/messages?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw new Error('Gmail error: ' + error);
        }

        const data = await response.json();

        if(!data.messages || data.messages.length === 0)
        {
            return { messages: [] };
        }

        const messages = [];

        for(const msg of data.messages.slice(0, input.max_results))
        {
            const detail = await fetch(base_url + '/users/me/messages/' + msg.id + '?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date', {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            const d = await detail.json();
            const headers = d.payload?.headers || [];

            messages.push({
                id: d.id,
                thread_id: d.threadId,
                subject: headers.find(h => h.name === 'Subject')?.value || '',
                from: headers.find(h => h.name === 'From')?.value || '',
                date: headers.find(h => h.name === 'Date')?.value || '',
                snippet: d.snippet || ''
            });
        }

        return { messages };
    }
});
