import commands from 'divhunt/commands';

commands.Item({
    id: 'health',
    exposed: true,
    out: {
        uptime: ['number', null, true]
    },
    callback: async function(properties, resolve)
    {
        resolve({
            uptime: process.uptime()
        });
    }
});
