import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'github:create-pr',
    provider: 'github',
    name: 'Create Pull Request',
    description: 'Create a new pull request in a GitHub repository.',
    input: {
        owner: { type: 'string', required: true, description: 'Repository owner' },
        repo: { type: 'string', required: true, description: 'Repository name' },
        title: { type: 'string', required: true, description: 'PR title' },
        body: { type: 'string', description: 'PR description' },
        head: { type: 'string', required: true, description: 'Branch with changes' },
        base: { type: 'string', required: true, description: 'Branch to merge into' }
    },
    output: {
        number: { type: 'number' },
        url: { type: 'string' }
    },
    execute: async function({ token, input, provider })
    {
        const response = await fetch(provider.Get('base_url') + '/repos/' + input.owner + '/' + input.repo + '/pulls', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: input.title,
                body: input.body || '',
                head: input.head,
                base: input.base
            })
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw divhunt.Error(502, error);
        }

        const data = await response.json();

        return { number: data.number, url: data.html_url };
    }
});
