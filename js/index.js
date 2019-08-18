
const config = {
  // 渲染方式，有特殊需求可選擇 WebGL or canvas，通常為 auto
  type: Phaser.AUTO,
  width,
  height,
  parent: 'app',
  // 物理引擎 params
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 850 },
      debug: false
    }
  },
  scene: [gameStart, gamePlay]
};
const game = new Phaser.Game(config);
