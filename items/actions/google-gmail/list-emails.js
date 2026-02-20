import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'google-gmail:list-emails',
    provider: 'google-gmail',
    name: 'List Emails',
    description: 'List emails from Gmail inbox.',
    input: {
        max_results: { type: 'number', value: 10, description: 'Max emails to return' },
        label: { type: 'string', value: 'INBOX', description: 'Label to filter by' }
    },
    output: {
        messages: { type: 'array' }
    },
    execute: async function({ token, input, provider })
    {
        const params = new URLSearchParams({
            maxResults: input.max_results,
            labelIds: input.label
        });

        const response = await fetch(provider.Get('base_url') + '/users/me/messages?' + params, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw divhunt.Error(502, error);
        }

        const data = await response.json();

        if(!data.messages || data.messages.length === 0)
        {
            return { messages: [] };
        }

        const messages = [];

        for(const message of data.messages.slice(0, input.max_results))
        {
            const detail = await fetch(provider.Get('base_url') + '/users/me/messages/' + message.id + '?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date', {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            const result = await detail.json();
            const headers = result.payload?.headers || [];

            messages.push({
                id: result.id,
                thread_id: result.threadId,
                subject: headers.find(header => header.name === 'Subject')?.value || '',
                from: headers.find(header => header.name === 'From')?.value || '',
                date: headers.find(header => header.name === 'Date')?.value || '',
                snippet: result.snippet || ''
            });
        }

        return { messages };
    }
});
