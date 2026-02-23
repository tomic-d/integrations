import commands from 'onetype/commands';

commands.Fn('http.server', 3000, {
    onStart: function()
    {
        console.log('Integrations HTTP server running on :3000');
    }
});
