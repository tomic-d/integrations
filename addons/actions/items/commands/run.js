import commands from 'divhunt/commands';
import actions from '#actions/addon.js';

commands.Item({
    id: 'actions:run',
    exposed: true,
    method: 'POST',
    endpoint: '/actions/run',
    in: {
        action_id: ['string', null, true],
        connection_id: ['string', null, true],
        input: ['object', {}]
    },
    out: {
        result: ['object', null, true]
    },
    callback: async function(properties, resolve)
    {
        const action = actions.ItemGet(properties.action_id);

        if(!action)
        {
            return resolve(null, 'Action not found.', 404);
        }

        const result = await action.Fn('run', properties.connection_id, properties.input);

        resolve({ result });
    }
});
