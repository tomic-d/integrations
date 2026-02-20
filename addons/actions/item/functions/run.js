import divhunt from 'divhunt';
import actions from '#actions/addon.js';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

actions.Fn('item.run', async function(action, connectionId, input = {})
{
    const inputSchema = action.Get('input');

    if(Object.keys(inputSchema).length > 0)
    {
        input = divhunt.DataDefine(input, inputSchema);
    }

    const token = await connections.Fn('token', connectionId);

    const provider = providers.ItemGet(action.Get('provider_id'));

    if(!provider)
    {
        throw divhunt.Error(404, 'Provider not found for action.');
    }

    const result = await action.Get('execute')({
        token,
        input,
        base_url: provider.Get('base_url'),
        provider
    });

    const outputSchema = action.Get('output');

    if(Object.keys(outputSchema).length > 0)
    {
        return divhunt.DataDefine(result, outputSchema);
    }

    return result;
});
