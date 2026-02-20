import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'github:issues:create',
    provider: 'github',
    name: 'Create Issue',
    description: 'Create a new issue in a GitHub repository.',
    input: {
        owner: { type: 'string', required: true, description: 'Repository owner' },
        repo: { type: 'string', required: true, description: 'Repository name' },
        title: { type: 'string', required: true, description: 'Issue title' },
        body: { type: 'string', description: 'Issue body' },
        labels: { type: 'array', description: 'Labels to add' }
    },
    output: {
        number: { type: 'number' },
        url: { type: 'string' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const response = await fetch(provider.Get('base_url') + '/repos/' + input.owner + '/' + input.repo + '/issues', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: input.title,
                body: input.body || '',
                labels: input.labels || []
            })
        });

        if(!response.ok)
        {
            throw divhunt.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({ number: data.number, url: data.html_url });
    }
});
