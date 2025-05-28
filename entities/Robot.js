export default class Robot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'robot');
    this.scene = scene;
    this.target = null;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setSize(32, 32);
    this.speed = 250;
  }

  update() {
    if (!this.active) return;

    if (!this.target || !this.target.active) {
      this.target = this.findNearestMonster();
    }

    if (this.target) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const length = Math.hypot(dx, dy);

      if (length > 0) {
        this.setVelocity((dx / length) * this.speed, (dy / length) * this.speed);
      }
    } else {
      this.setVelocity(0);
    }
  }

  findNearestMonster() {
    let nearest = null;
    let minDist = Infinity;

    this.scene.monsters.children.iterate(monster => {
      if (!monster || !monster.active) return;

      const dist = Phaser.Math.Distance.Between(this.x, this.y, monster.x, monster.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = monster;
      }
    });

    return nearest;
  }
}
