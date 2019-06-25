const app = require('./app');
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

httpServer.listen(3001);

const MESSAGE = '[Message]';
const MESSAGE_CHANGE = `${MESSAGE} CHANGE`;
const MESSAGE_SEND = `${MESSAGE} SEND`;
const MESSAGE_RECEIVE = `${MESSAGE} RECEIVE`;
const MESSAGE_NEW = `${MESSAGE} NEW`;

io.on('connection', function(socket){
  console.log('a user connected1', socket.id);
  socket.on(MESSAGE_SEND, function(message){
    console.log('a user sent message2 -> ' + message);
    socket.broadcast.emit(MESSAGE_NEW, message);
  });
});

