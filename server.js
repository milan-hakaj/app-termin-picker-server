const app = require('./app');
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

httpServer.listen(3001);

let socketsHandler = {};

io.on('connection', function(socket){
  const handshakeData = socket.request;
  const userId = handshakeData._query['UserId'];

  if (!socketsHandler[userId]) {
    socketsHandler[userId] = socket.id;
  }

  socket.on('disconnect', function() {
    for (let key in socketsHandler) {
      if (socketsHandler.hasOwnProperty(key)) {
        if (socketsHandler[key] === socket.id) {
          delete socketsHandler[key];
        }
      }
    }
  });

  socket.on('direct message sent', function(data){
    const otherSocket = socketsHandler[data.messageData.receiverId];
    socket.to(otherSocket).emit('DIRECT_MESSAGE_RECEIVED', data);
  });

  socket.on('USER_STARTED_TYPING', function(data) {
    const otherSocket = socketsHandler[data.to];
    socket.to(otherSocket).emit('USER_IS_TYPING', data);
  });

});

