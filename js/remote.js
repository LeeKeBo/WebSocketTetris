var Remote = function(socket) {
  var game;
  var bindEvents = function() {
    socket.on('init', function(data) {
      start(data.type, data.dir);
    });
    socket.on('next', function(data) {
      game.performNext(data.type, data.dir);
    });
    socket.on('down',function(data){
      game.down();
    })
    socket.on('left', function(data) {
      game.left();
    });
    socket.on('right', function(data) {
      game.right();
    });
    socket.on('fall', function(data) {
      game.fall();
    });
    socket.on('rotate', function(data) {
      game.rotate();
    });
    socket.on('fixed', function(data) {
      game.fixed();
    });
    socket.on('line', function(data) {
      game.cleanDivs();
      game.addScore(data);
    });

    socket.on('time', function(data) {
      game.setTime(data);
    });

    socket.on('lose',function(data){
      game.gameOver(false);
    });

    socket.on('addTailLines',function(data){
      game.addTailLines(data);
    })

  }
  var start = function(type,dir) {
    var doms = {
      gameDiv: document.getElementById('remote_game'),
      nextDiv: document.getElementById('remote_next'),
      timeDiv: document.getElementById('remote_time'),
      scoreDiv: document.getElementById('remote_score'),
      gameOverDiv: document.getElementById('remote_gameOver')
    };
    game = new Game();
    game.init(doms, type, dir);
  }
  bindEvents();



}
