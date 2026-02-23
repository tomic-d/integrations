import commands from 'onetype/commands';

commands.Fn('grpc.server', 50000, {
    onStart: function()
    {
        console.log('Integrations gRPC server running on :50000');
    },
    onStreamConnect: function(stream)
    {
        console.log('Client connected');
    },
    onError: function(message)
    {
        console.log('gRPC error:', message);
    },
    onStreamError: function(stream)
    {
        console.log('Stream error');
    },
    onStreamEnd: function(stream)
    {
        console.log('Client disconnected');
    }
});
