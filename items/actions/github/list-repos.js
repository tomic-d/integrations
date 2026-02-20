import divhunt from 'divhunt';
import actions from '#actions/addon.js';

actions.Item({
    id: 'github:list-repos',
    provider: 'github',
    name: 'List Repositories',
    description: 'List repositories for the authenticated user.',
    input: {
        sort: { type: 'string', value: 'updated', description: 'Sort by: created, updated, pushed, full_name' },
        per_page: { type: 'number', value: 30, description: 'Results per page' }
    },
    output: {
        repos: { type: 'array' }
    },
    execute: async function({ token, input, provider }, resolve)
    {
        const params = new URLSearchParams({
            sort: input.sort,
            per_page: input.per_page
        });

        const response = await fetch(provider.Get('base_url') + '/user/repos?' + params, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': 'Bearer ' + token
            }
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw divhunt.Error(502, error);
        }

        const data = await response.json();

        resolve({
            repos: data.map(repo => ({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                private: repo.private,
                url: repo.html_url,
                description: repo.description || ''
            }))
        });
    }
});
