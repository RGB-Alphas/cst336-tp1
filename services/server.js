const io = require('socket.io')();

io.on('connection', client => {
    client.emit('step', {data: 'hellow world'});
});

io.listen(3000);