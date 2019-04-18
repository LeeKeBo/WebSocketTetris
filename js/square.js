var Square = function() {
  //记录方块数据
  this.data = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  //原点
  this.origin = {
    x: 0,
    y: 0
  }
  //形状
  this.dir = 0;
}
//通过检查下降后的位置是否合法，判断能否下降
Square.prototype.canDown = function(isValid) {
  var test = {};
  test.x = this.origin.x + 1;
  test.y = this.origin.y;
  return isValid(test, this.data);
}
//下降
Square.prototype.down = function() {
  this.origin.x++;
}
//通过检查左移后的位置是否合法，判断能否下降
Square.prototype.canLeft = function(isValid) {
  var test = {};
  test.x = this.origin.x;
  test.y = this.origin.y - 1;
  return isValid(test, this.data);
}
//左移
Square.prototype.left = function() {
  this.origin.y--;
}
//通过检查右移后的位置是否合法，判断能否下降
Square.prototype.canRight = function(isValid) {
  var test = {};
  test.x = this.origin.x;
  test.y = this.origin.y + 1;
  return isValid(test, this.data);
}
//右移
Square.prototype.right = function() {
  this.origin.y++;
}
//通过检查旋转后的位置是否合法，判断能否下降
Square.prototype.canRotate = function(isValid) {
  var dirTemp = this.dir + 1;
  if (dirTemp == 4)
    dirTemp = 0;
  var test = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  for (var i = 0; i < test.length; i++)
    for (var j = 0; j < test[0].length; j++)
      test[i][j] = this.rotateData[dirTemp][i][j]
  return isValid(this.origin, test);
}
//旋转
Square.prototype.rotate = function(num) {
  if (!num)
    num = 1;
  this.dir += num;
  this.dir %= 4;
  for (var i = 0; i < this.data.length; i++)
    for (var j = 0; j < this.data[0].length; j++)
      this.data[i][j] = this.rotateData[this.dir][i][j];
}
