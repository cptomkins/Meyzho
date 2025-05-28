export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'meyzho');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.speed = 200;
  }

  move(cursors) {
    let dx = 0, dy = 0;

    if (cursors.left.isDown) dx -= 1;
    if (cursors.right.isDown) dx += 1;
    if (cursors.up.isDown) dy -= 1;
    if (cursors.down.isDown) dy += 1;

    const length = Math.hypot(dx, dy);
    if (length > 0) {
      this.setVelocity((dx / length) * this.speed, (dy / length) * this.speed);
    } else {
      this.setVelocity(0);
    }
  }
}
