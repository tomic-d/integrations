import onetype from 'onetype';
import actions from '#actions/addon.js';

actions.Item({
    id: 'github:pull-requests:create',
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
    execute: async function({ token, input, provider }, resolve)
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
            throw onetype.Error(502, await response.text());
        }

        const data = await response.json();

        resolve({ number: data.number, url: data.html_url });
    }
});
