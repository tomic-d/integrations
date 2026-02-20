import actions from '#actions/addon.js';

actions.Item({
    id: 'github:list-repos',
    provider_id: 'github',
    name: 'List Repositories',
    description: 'List repositories for the authenticated user.',
    input: {
        sort: { type: 'string', value: 'updated', description: 'Sort by: created, updated, pushed, full_name' },
        per_page: { type: 'number', value: 30, description: 'Results per page' }
    },
    output: {
        repos: { type: 'array' }
    },
    execute: async function({ token, input, base_url })
    {
        const params = new URLSearchParams({
            sort: input.sort,
            per_page: input.per_page
        });

        const response = await fetch(base_url + '/user/repos?' + params, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': 'Bearer ' + token
            }
        });

        if(!response.ok)
        {
            const error = await response.text();
            throw new Error('GitHub error: ' + error);
        }

        const data = await response.json();

        return {
            repos: data.map(r => ({
                id: r.id,
                name: r.name,
                full_name: r.full_name,
                private: r.private,
                url: r.html_url,
                description: r.description || ''
            }))
        };
    }
});
