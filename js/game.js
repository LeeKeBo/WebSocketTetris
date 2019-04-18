var Game = function() {
  var nextData = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  var gameData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  var gameDivs = [];
  var nextDivs = [];
  var timeDiv, scoreDiv, gameOverDiv;
  var curSquare, nextSquare;
  var score = 0;

  //初始化
  var init = function(doms, type, dir) {
    var gameDiv = doms.gameDiv;
    var nextDiv = doms.nextDiv;
    timeDiv = doms.timeDiv;
    scoreDiv = doms.scoreDiv;
    gameOverDiv = doms.gameOverDiv;
    nextSquare = SquareFactory.prototype.make(type, dir);
    initDiv(gameDiv, gameData, gameDivs)
    initDiv(nextDiv, nextSquare.data, nextDivs);
    // refreshDiv(gameData, gameDivs);
    refreshDiv(nextSquare.data, nextDivs);
  }

  function initDiv(container, data, divs) {
    for (var i = 0; i < data.length; i++) {
      var div = [];
      for (var j = 0; j < data[0].length; j++) {
        var newDiv = document.createElement('div');
        newDiv.className = 'none';
        newDiv.style.top = (i * 20) + 'px';
        newDiv.style.left = (j * 20) + 'px';
        container.appendChild(newDiv);
        div.push(newDiv);
      }
      divs.push(div);
    }
  }

  function refreshDiv(data, divs) {
    for (var i = 0; i < data.length; i++)
      for (var j = 0; j < data[0].length; j++) {
        if (data[i][j] == 0)
          divs[i][j].className = 'none';
        else if (data[i][j] == 1)
          divs[i][j].className = 'done';
        else if (data[i][j] == 2)
          divs[i][j].className = 'current';
      }
  }

  //检查在pos位置上加x,y后的位置是否合法
  var check = function(pos, x, y) {
    if (pos.x + x < 0)
      return false;
    else if (pos.x + x >= gameData.length)
      return false;
    else if (pos.y + y < 0)
      return false;
    else if (pos.y + y >= gameData[0].length)
      return false;
    else if (gameData[pos.x + x][pos.y + y] == 1)
      return false;
    return true;
  }

  //判断在pos位置上放置data是否合法
  var isValid = function(pos, data) {
    for (var i = 0; i < data.length; i++)
      for (var j = 0; j < data[0].length; j++)
        if (data[i][j] != 0)
          if (!check(pos, i, j))
            return false;
    return true;
  }

  //清除方格原先位置上的数据（否则方格移动后原来位置上的数据还保留）
  var cleanData = function() {
    for (var i = 0; i < curSquare.data.length; i++)
      for (var j = 0; j < curSquare.data[0].length; j++) {
        if (check(curSquare.origin, i, j))
          gameData[curSquare.origin.x + i][curSquare.origin.y + j] = 0;
      }
  }

  //设置数据
  var setData = function() {
    for (var i = 0; i < curSquare.data.length; i++)
      for (var j = 0; j < curSquare.data[0].length; j++) {
        if (check(curSquare.origin, i, j))
          gameData[curSquare.origin.x + i][curSquare.origin.y + j] = curSquare.data[i][j];
      }
  }
  //下降
  var down = function() {
    if (curSquare.canDown(isValid)) {
      cleanData();
      curSquare.down();
      setData();
      refreshDiv(gameData, gameDivs);
      return true;
    }
    return false;
  };
  //左移
  var left = function() {
    if (curSquare.canLeft(isValid)) {
      cleanData();
      curSquare.left();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  };
  //右移
  var right = function() {
    if (curSquare.canRight(isValid)) {
      cleanData();
      curSquare.right();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  };
  //旋转
  var rotate = function() {
    if (curSquare.canRotate(isValid)) {
      cleanData();
      curSquare.rotate();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  };
  //坠落
  var fall = function() {
    while (down()) {;
    }
  }

  //固定
  var fixed = function() {
    for (var i = 0; i < curSquare.data.length; i++) {
      for (var j = 0; j < curSquare.data[0].length; j++)
        if (check(curSquare.origin, i, j))
          if (gameData[curSquare.origin.x + i][curSquare.origin.y + j] == 2)
            gameData[curSquare.origin.x + i][curSquare.origin.y + j] = 1;
    }
    refreshDiv(gameData, gameDivs);
  };

  //下一个方块
  var performNext = function(type, dir) {
    curSquare = nextSquare;
    nextSquare = SquareFactory.prototype.make(type, dir);
    setData();
    refreshDiv(gameData, gameDivs);
    refreshDiv(nextSquare.data, nextDivs);
  }

  var cleanDivs = function() {
    var line = 0;
    for (var i = gameData.length - 1; i >= 0; i--) {
      var clean = true;
      for (var j = 0; j < gameData[0].length; j++)
        if (gameData[i][j] != 1) {
          clean = false;
          break;
        }
      if (clean) {
        line++;
        for (var m = i; m > 0; m--) {
          for (var n = 0; n < gameData[0].length; n++)
            gameData[m][n] = gameData[m - 1][n];
        }
        for (var n = 0; n < gameData[0].length; n++)
          gameData[0][n] = 0;
        i++;
      }
    }
    return line;
  }

  //判断游戏是否结束了
  var isGameOver = function() {
    var isOver = false;
    for (var i = 0; i < gameData[0].length; i++)
      if (gameData[1][i] == 1)
        isOver = true;
    return isOver;
  }

  //设置时间
  var setTime = function(time) {
    timeDiv.innerHTML = time;
  }

  //设置分数
  var addScore = function(line) {
    switch (line) {
      case 1:
        score += 10;
        break;
      case 2:
        score += 30;
        break;
      case 3:
        score += 60;
        break;
      case 4:
        score += 100;
        break;
    }
    scoreDiv.innerHTML = score;
  }

  //游戏结束，显示结果
  var gameOver = function(result) {
    if (result)
      gameOverDiv.innerHTML = 'Winner';
    else
      gameOverDiv.innerHTML = 'Loser';
  }

  //增加干扰行
  var addTailLines = function(lines) {
    for (var i = 0; i < gameData.length - lines.length; i++)
      gameData[i] = gameData[i + lines.length];
    for (var i = 0; i < lines.length; i++)
      gameData[gameData.length - lines.length + i] = lines[i];
    curSquare.origin.x -= lines.length;
    if (curSquare.origin.x < 0)
      curSquare.origin.x = 0;
    refreshDiv(gameData, gameDivs);

  }

  //导出数据
  this.init = init;
  this.down = down;
  this.left = left;
  this.right = right;
  this.rotate = rotate;
  this.fall = fall;
  this.fixed = fixed;
  this.performNext = performNext;
  this.cleanDivs = cleanDivs;
  this.isGameOver = isGameOver;
  this.setTime = setTime;
  this.addScore = addScore;
  this.gameOver = gameOver;
  this.addTailLines= addTailLines;
}
