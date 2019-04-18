var Local = function(socket) {
  var game; //游戏对象
  var INTERVAL = 200;
  var timer = null;
  var timeCount = 0;
  var time = 0;
  //监听键盘事件
  var bindKeyEvent = function() {
    document.onkeydown = function(e) {
      if (e.keyCode == 37) { //左移
        game.left();
        socket.emit('left');
      } else if (e.keyCode == 38) { //上移
        game.rotate();
        socket.emit('rotate');
      } else if (e.keyCode == 39) { //右移
        game.right();
        socket.emit('right');
      } else if (e.keyCode == 40) { //下移
        game.down();
        socket.emit('down');
      } else if (e.keyCode == 32) { //空格
        game.fall();
        socket.emit('fall');
      }
    }
  };
  var move = function() {
    timeFunction();
    if (!game.down()) {
      game.fixed();         //落地的方块固定
      socket.emit('fixed');
      var line = game.cleanDivs();    //清除成功的行
      if (line) {
        game.addScore(line);
        socket.emit('line', line);
        var bottomLines = addInterferenceLines(line);
        socket.emit('bottomLines',bottomLines);
      }
      var isOver = game.isGameOver();
      if (isOver) {
        game.gameOver(false);
        socket.emit('lose');
        document.getElementById('remote_gameOver').innerHTML='Winner'
        stop();
      } else {
        var type = nextType();
        var dir = nextDir();
        game.performNext(type, dir); //将下一个方块放入游戏面板并添加新的方块
        socket.emit('next', {
          type: type,
          dir: dir
        });
      }
    }
    else{
      socket.emit('down');
    }
  }
  var nextType = function() {
    return Math.ceil(Math.random() * 7) - 1;
  }
  var nextDir = function() {
    return Math.ceil(Math.random() * 4) - 1;
  }
  var timeFunction = function() {
    timeCount++;
    if (timeCount == 5) {
      timeCount = 0;
      time++;
      game.setTime(time);
      socket.emit('time',time);
      if (time % 10 == 0)
        addInterferenceLines(1);
    }
  }
  var addInterferenceLines = function(linesNum) {
    var lines = [];
    for (var i = 0; i < linesNum; i++) {
      var line = [];
      for (var j = 0; j < 10; j++) {
        line[j] = Math.ceil(Math.random() * 2) - 1;
      }
      lines.push(line);
    }
    game.addTailLines(lines);
    return lines;
  }

  var start = function() {
    var doms = {
      gameDiv: document.getElementById('local_game'),
      nextDiv: document.getElementById('local_next'),
      timeDiv: document.getElementById('local_time'),
      scoreDiv: document.getElementById('local_score'),
      gameOverDiv: document.getElementById('local_gameOver')
    };
    game = new Game();
    var type = nextType();
    var dir = nextDir();
    game.init(doms, type, dir);
    socket.emit('init', {
      type: type,
      dir: dir
    });
    bindKeyEvent();
    type = nextType();
    dir = nextDir();
    game.performNext(type, dir);
    socket.emit('next', {
      type: type,
      dir: dir
    });
    timer = setInterval(move, INTERVAL);
  }
  var stop = function() {
    if (timer) {
      clearInterval(timer);
      timer = null;
      bindKeyEvent = null;
    }
  }

  socket.on('start', function() {
    document.getElementById('waiting').innerHTML = '';
    start();
  });
  socket.on('lose',function(data){
    game.gameOver(true);
    stop();
  })
  socket.on('leave',function(){
    document.getElementById('local_gameOver').innerHTML='对方掉线了';
    document.getElementById('remote_gameOver').innerHTML='掉线了';
    stop();
  });
  socket.on('bottomLines',function(data){
    game.addTailLines(data);
    socket.emit('addTailLines',data);
  });
}
