const app = require('./app');
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

httpServer.listen(3001);

io.on('connection', function(socket){
  console.log('a user connected1', socket.id);

  socket.on('direct message sent', function(messageData){
    console.log('a user sent message2 -> ', messageData);
    socket.broadcast.emit('broadcast new message', messageData);
  });
});

