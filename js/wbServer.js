var app = require('http').createServer();
var io = require('socket.io')(app);

var clientCount = 0;
var socketMap = {};

var PORT = 3000;
app.listen(PORT);

var bindListener = function(socket, event) {
  socket.on(event, function(data) {
    if (socket.clientNum % 2 == 1) {
      if (socketMap[socket.clientNum + 1])
        socketMap[socket.clientNum + 1].emit(event, data);
    } else {
      if (socketMap[socket.clientNum - 1])
        socketMap[socket.clientNum - 1].emit(event, data);
    }
  });

}

io.on('connection', function(socket) {
  clientCount++;
  socket.clientNum = clientCount;
  socketMap[clientCount] = socket;

  if (clientCount % 2 == 1) {
    socket.emit('waiting', 'waiting for another player')
  } else {
    if (socketMap[clientCount - 1]) {
      socket.emit('start');
      socketMap[clientCount - 1].emit('start');
    }
    else{
      socket.emit('leave');
    }
  }

  bindListener(socket, 'init');
  bindListener(socket, 'next');
  bindListener(socket, 'left');
  bindListener(socket, 'right');
  bindListener(socket, 'fall');
  bindListener(socket, 'fixed');
  bindListener(socket, 'line');
  bindListener(socket, 'rotate');
  bindListener(socket, 'down');
  bindListener(socket,'time');
  bindListener(socket,'lose');
  bindListener(socket,'bottomLines');
  bindListener(socket,'addTailLines');

  socket.on('disconnect', function() {
    if (socket.clientNum % 2 == 1) {
      if (socketMap[socket.clientNum + 1])
        socketMap[socket.clientNum + 1].emit('leave');
    } else {
      if (socketMap[socket.clientNum - 1])
        socketMap[socket.clientNum - 1].emit('leave');
    }
    delete(socketMap[socket.clientNum]);
  });

});


console.log('Server is listening port ' + PORT);
