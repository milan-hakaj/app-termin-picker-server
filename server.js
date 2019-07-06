const app = require('./app');
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

httpServer.listen(3001);

const sockets = {};

io.on('connection', function(socket){
  const handshakeData = socket.request;
  const userId = handshakeData._query['UserId'];

  if (!sockets[userId]) {
    sockets[userId] = socket.id;
  }

  socket.on('direct message sent', function(data){
    const otherSocket = sockets[data.messageData.receiverId];
    socket.to(otherSocket).emit('DIRECT_MESSAGE_RECEIVED', data);
  });


});

