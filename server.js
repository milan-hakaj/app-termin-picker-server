const app = require('./app');
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

httpServer.listen(3001);

io.on('connection', function(socket){
  socket.on('direct message sent', function(messageData){
    socket.broadcast.emit('broadcast new message', messageData);
  });
});

