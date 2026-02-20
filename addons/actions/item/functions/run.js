import divhunt from 'divhunt';
import actions from '#actions/addon.js';
import connections from '#connections/addon.js';
import providers from '#providers/addon.js';

actions.Fn('item.run', function(action, id, input = {})
{
    this.methods.init = async (resolve) =>
    {
        this.resolve = resolve;

        input = this.methods.validate(input, action.Get('input'));
        const token = await connections.Fn('token', id);
        const provider = this.methods.provider();

        await action.Get('execute')({ token, input, provider }, this.methods.done);
    };

    this.methods.validate = (data, schema) =>
    {
        if(Object.keys(schema).length > 0)
        {
            return divhunt.DataDefine(data, schema);
        }

        return data;
    };

    this.methods.provider = () =>
    {
        const provider = providers.ItemGet(action.Get('provider'));

        if(!provider)
        {
            throw divhunt.Error(404, 'Provider not found for action.');
        }

        return provider;
    };

    this.methods.done = (data) =>
    {
        data = this.methods.validate(data, action.Get('output'));
        this.resolve(data);
    };

    return new Promise((resolve) =>
    {
        this.methods.init(resolve);
    });
});
