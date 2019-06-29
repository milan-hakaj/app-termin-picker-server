const app = require('./app');
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

httpServer.listen(3001);

const DM = '[DM]';
const DM_DETECTED = `${DM} ON DETECTED`;
const DM_SEND = `${DM} SEND`;
const DM_RECEIVE = `${DM} RECEIVE`;
const DM_NEW = `${DM} NEW`;

io.on('connection', function(socket){
  console.log('a user connected1', socket.id);
  socket.on(DM_SEND, function(messageData){
    console.log('a user sent message2 -> ', messageData);
    socket.broadcast.emit(DM_NEW, messageData);
  });
});

