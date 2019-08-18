
const gameStart = {
  key: 'gameStart',
  preload: function() {
    // 載入資源
    this.load.image('bg1', '../images/background/bg-front.png');
    this.load.image('bg2', '../images/background/bg-middle.png');
    this.load.image('bg3', '../images/background/bg-back.png');
    this.load.image('bg4', '../images/background/bg-color.png');
    this.load.image('footer', '../images/background/bg-ground.png');

    this.load.image('title', '../images/txt-title.png')
    this.load.image('subTitle', '../images/txt-subtitle.png')
    this.load.image('startButton', '../images/btn-press-start.png')
  },
  create: function() {
    // 載入完成，遊戲相關設定
    this.bg4 = this.add.tileSprite(width / 2, height / 2, width, height, 'bg4');
    this.bg3 = this.add.tileSprite(width / 2, height / 2, width, height, 'bg3');
    this.bg2 = this.add.tileSprite(width / 2, height / 2, width, height, 'bg2');
    this.bg1 = this.add.tileSprite(width / 2, height / 2, width, height, 'bg1');
    this.footer = this.add.tileSprite(
      width / 2,
      height - 200 + 100,
      width,
      200,
      'footer'
    );

    this.title = this.add.image(width / 2, height / 2 - 100, 'title')
    this.title.setScale(0.7)
    this.startButton = this.add.image(width / 2, height / 2 + 100, 'startButton')
    this.startButton.setScale(0.7)
    this.startButton.setInteractive()
    this.startButton.on('pointerdown', () => {
      this.scene.start('gamePlay')
    })
  },
  update: function() {
    // 更新
    this.bg1.tilePositionX += 4;
    this.bg2.tilePositionX += 2;
    this.bg3.tilePositionX += 3;
    this.footer.tilePositionX += 4;
  }
};