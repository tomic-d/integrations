import commands from 'divhunt/commands';
import actions from '#actions/addon.js';

commands.Item({
    id: 'actions:run',
    exposed: true,
    method: 'POST',
    endpoint: '/actions/run',
    in: {
        action: ['string', null, true],
        connection: ['string', null, true],
        input: ['object', {}]
    },
    out: {
        result: ['object', null, true]
    },
    callback: async function(properties, resolve)
    {
        const action = actions.ItemGet(properties.action);

        if(!action)
        {
            return resolve(null, 'Action not found.', 404);
        }

        const result = await action.Fn('run', properties.connection, properties.input);

        resolve({ result });
    }
});
