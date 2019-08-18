const keyFrame = self => {
  self.anims.create({
    key: 'run',
    frames: self.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });
  self.anims.create({
    key: 'speedUp',
    frames: self.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
    frameRate: 5,
    repeat: -1
  });
  self.anims.create({
    key: 'gameover',
    frames: self.anims.generateFrameNumbers('player', { start: 6, end: 6 }),
    frameRate: 5,
    repeat: -1
  });
  self.anims.create({
    key: 'goUp',
    frames: self.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
    frameRate: 5,
    repeat: -1
  });
};
