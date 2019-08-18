function renderTwoDigitSeoncs(seconds) {
  if (seconds % 60 < 10) return `0${seconds % 60}`;
  else return `${seconds % 60}`;
}
const getRandom = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const obstacleSpeed = 4;

const gamePlay = {
  key: 'gamePlay',
  preload: function() {
    // 載入資源
    this.load.image('bg1', './images/background/bg-front.png');
    this.load.image('bg2', './images/background/bg-middle.png');
    this.load.image('bg3', './images/background/bg-back.png');
    this.load.image('bg4', './images/background/bg-color.png');
    this.load.image('footer', './images/background/bg-ground.png');
    this.load.image('time', './images/time.png');

    this.load.image('obstacleLv1Lg', './images/item-level-1-branch.png');
    this.load.image('obstacleLv1Md', './images/item-level-1-rock.png');
    this.load.image('obstacleLv2Lg', './images/item-level-2-smoke-lg.png');
    this.load.image('obstacleLv2Md', './images/item-level-2-smoke-sm.png');
    this.load.image('obstacleLv3Lg', './images/item-level-3-fire-lg.png');
    this.load.image('obstacleLv3Md', './images/item-level-3-fire-sm.png');

    this.load.image('gameover', './images/txt-game-over.png');
    this.load.image('tryAgain', './images/btn-try-again.svg');

    this.load.image('congratulations', './images/txt-congratulations.png');
    this.load.image('playAgain', './images/btn-play-again.png');

    this.load.spritesheet('player', './images/player.png', {
      frameWidth: 144,
      frameHeight: 120
    });

    this.gameTime = 30;
    this.speedLv = 1;
    this.gameStop = false;

    // 存放障礙物
    this.obstacleArr = [];
    this.obstacleIdx = 0;
    this.obstacleArr2 = [];
    this.obstacleIdx2 = 1;
    this.iskeyJump = true; // 是否可以跳躍
    this.iskeyDown = true; // 是否可以跳躍
  },
  create: function() {
    // 物理效果
    const addPhysics = GameObject => {
      this.physics.add.existing(GameObject);
      GameObject.body.immovable = true;
      GameObject.body.moves = false;
    };
    // 載入完成，遊戲相關設定

    this.bg4 = this.add.tileSprite(width / 2, height / 2, width, height, 'bg4');
    this.bg3 = this.add.tileSprite(width / 2, height / 2, width, height, 'bg3');
    this.bg2 = this.add.tileSprite(width / 2, height / 2, width, height, 'bg2');
    this.bg1 = this.add.tileSprite(width / 2, height / 2, width, height, 'bg1');
    this.time = this.add.image(width - 300, height - 30, 'time');

    this.footer = this.add.tileSprite(
      width / 2,
      height - 100,
      width,
      200,
      'footer'
    );
    // footer 物理引擎設置
    addPhysics(this.footer);
    this.footer.body.immovable = true; // 設定物件不會動，不受重力影響
    this.footer.body.moves = false; // 物件的位置選轉是否受重力、加速度等影響

    // 設置 player
    this.player = this.physics.add.sprite(100, 100, 'player');
    this.player.setBounce(0.7); // 設定角色彈跳值
    this.player.setSize(90, 90); // 設定角色顯示大小
    this.player.setCollideWorldBounds(true); // 設定角色碰撞邊界

    // 浦公英動作
    keyFrame(this);


    // 計時器設定
    this.timerText = this.add.text(
      width - 280,
      height - 43,
      `0${Math.floor(this.gameTime / 60)}:${renderTwoDigitSeoncs(
        this.gameTime
      )}`,
      { fontFamily: 'Roboto', fontSize: '20px' }
    );
    let timer = setInterval(() => {
      this.gameTime--;
      // 難度控制
      if (this.gameTime < 20 && this.gameTime > 10) {
        this.speedLv = 2;
      } else if (this.gameTime < 10 && this.gameTime > 0) {
        this.speedLv = 3;
      }
      if (this.gameTime < 1) {
        let congratulations = this.add.image(
          width / 2,
          height / 2 - 50,
          'congratulations'
        );
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        congratulations.setScale(0.8);
        let playAgain = this.add.image(width / 2, height / 2 + 40, 'playAgain');
        playAgain.setScale(0.6);
        playAgain.setInteractive();
        playAgain.on('pointerdown', () => this.scene.start('gameStart'));
        clearInterval(timer);
        this.gameStop = true;
      }
      // 設定時間文字
      this.timerText.setText(
        `0${Math.floor(this.gameTime / 60)}:${renderTwoDigitSeoncs(
          this.gameTime
        )}`
      );
    }, 1000);

    // 怪物的座標資訊
    const obstaclePosition = [
      { name: 'obstacleLv1Lg', x: width + 250, y: 100, w: 250, h: 250 },
      {
        name: 'obstacleLv1Md',
        x: width + 370,
        y: height - 290,
        w: 370,
        h: 194
      },
      { name: 'obstacleLv2Lg', x: 1.2 * width, y: 100, w: 368, h: 192 },
      {
        name: 'obstacleLv2Md',
        x: 1.5 * width - 288,
        y: height - 290,
        w: 288,
        h: 136
      },
      { name: 'obstacleLv3Lg', x: 1.7 * width - 190, y: 100, w: 192, h: 224 },
      {
        name: 'obstacleLv3Md',
        x: 2 * width - 135,
        y: height - 290,
        w: 136,
        h: 152
      }
    ];
    //碰撞到後停止遊戲
    const afterHit = (player, rock) => {
      this.gameStop = true;
      this.player.setBounce(0);
      this.player.setSize(90, 90, 0);
      this.player.anims.play('gameover', true);

      clearInterval(timer);
      let gameover = this.add.image(
        width / 2 + 200,
        height / 2 - 40,
        'gameover'
      );
      gameover.setScale(0.8);
      let tryAgain = this.add.image(width / 2, height / 2 + 30, 'tryAgain');
      tryAgain.setScale(0.6);
      tryAgain.setInteractive();
      tryAgain.on('pointerdown', () => this.scene.start('gameStart'));
    };
    // 產生怪物
    for (let i = 0; i < 10; i++) {
      let BoolIdx = getRandom(5, 0);
      let BoolIdx2 = getRandom(5, 0);
      this['obstacleA' + i] = this.add.tileSprite(
        obstaclePosition[BoolIdx].x,
        obstaclePosition[BoolIdx].y,
        obstaclePosition[BoolIdx].w,
        obstaclePosition[BoolIdx].h,
        obstaclePosition[BoolIdx].name
      );
      this['obstacleB' + i] = this.add.tileSprite(
        obstaclePosition[BoolIdx2].x,
        obstaclePosition[BoolIdx2].y,
        obstaclePosition[BoolIdx2].w,
        obstaclePosition[BoolIdx2].h,
        obstaclePosition[BoolIdx2].name
      );
      this.obstacleArr.push(this['obstacleA' + i]);
      this.obstacleArr2.push(this['obstacleB' + i]);
      addPhysics(this['obstacleA' + i]);
      addPhysics(this['obstacleB' + i]);
      this.physics.add.collider(this.player, this['obstacleA' + i], afterHit);
      this.physics.add.collider(this.player, this['obstacleB' + i], afterHit);
    }

    this.player.anims.play('run', true);
    // player & footer 會有物理相撞效果
    this.physics.add.collider(this.player, this.footer);
  },
  update: function() {
    // 更新
    if (this.gameStop) {
      return;
    }
    this.bg1.tilePositionX += 4 * this.speedLv;
    this.bg2.tilePositionX += 2 * this.speedLv;
    this.bg3.tilePositionX += 3 * this.speedLv;
    this.footer.tilePositionX += 4 * this.speedLv;

    this.obstacleArr[this.obstacleIdx].x -= obstacleSpeed * this.speedLv;
    this.obstacleArr2[this.obstacleIdx2].x -= obstacleSpeed * this.speedLv;

    // 檢測怪物是否超出邊界然後返回
    for (let i = 0; i < this.obstacleArr.length; i++) {
      if (this.obstacleArr[i].x <= -100) {
        this.obstacleArr[i].x = width + 200;
        this.obstacleIdx = getRandom(this.obstacleArr.length - 1, 0);
      }
      if (this.obstacleArr2[i].x <= -100) {
        this.obstacleArr2[i].x = width + getRandom(400, 200);
        this.obstacleIdx2 = getRandom(this.obstacleArr2.length - 1, 0);
      }
    }

    // 控制左右加速
    const keyboard = this.input.keyboard.createCursorKeys();
    if (keyboard.right.isDown) {
      this.player.setVelocityX(300);
      this.player.anims.play('speedUp', true);
      this.player.flipX = false;
    } else if (keyboard.left.isDown) {
      this.player.setVelocityX(-350);
      this.player.anims.play('speedUp', true);
      this.player.flipX = true;
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('run', true);
      this.player.flipX = false;
    }
    // 控制上升
    if (keyboard.up.isDown) {
      if (this.iskeyJump) {
        this.iskeyJump = false;
        this.player.setVelocityY(-300);
      }
    } else {
      this.iskeyJump = true;
    }
    // 控制下墜
    if (keyboard.down.isDown) {
      if (this.isKeyDown) {
        this.isKeyDown = false;
        this.player.setVelocityY(200);
      }
    } else {
      this.isKeyDown = true;
    }
  }
};
