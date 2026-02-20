import divhunt from 'divhunt';
import actions from '#actions/addon.js';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

actions.Fn('item.run', async function(action, id, input = {})
{
    const inputSchema = action.Get('input');

    if(Object.keys(inputSchema).length > 0)
    {
        input = divhunt.DataDefine(input, inputSchema);
    }

    const token = await connections.Fn('token', id);

    const provider = providers.ItemGet(action.Get('provider'));

    if(!provider)
    {
        throw divhunt.Error(404, 'Provider not found for action.');
    }

    const result = await new Promise(async (promiseResolve, promiseReject) =>
    {
        try
        {
            const resolve = (data) =>
            {
                const outputSchema = action.Get('output');

                if(Object.keys(outputSchema).length > 0)
                {
                    data = divhunt.DataDefine(data, outputSchema);
                }

                promiseResolve(data);
            };

            await action.Get('execute')({ token, input, provider }, resolve);
        }
        catch(error)
        {
            promiseReject(error);
        }
    });

    return result;
});
