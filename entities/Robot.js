import { dropEnergy } from '../systems/ResourceSystem.js';


export default class Robot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'robot');
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.speed = 150; // Reduced for smoother path traversal

    this.target = null;
    this.path = [];
    this.pathIndex = 0;
    this.repathTimer = 0;
    this.repathInterval = 500; // milliseconds
  }

  setTarget(monster) {
    if (this.target !== monster) {
      this.target = monster;
      this.calculatePath();
    }
  }

  calculatePath() {
    if (!this.target || !this.target.active) return;

    const tileSize = this.scene.tileSize;
    const startX = Math.floor(this.x / tileSize);
    const startY = Math.floor(this.y / tileSize);
    const endX = Math.floor(this.target.x / tileSize);
    const endY = Math.floor(this.target.y / tileSize);

    this.scene.easystar.findPath(startX, startY, endX, endY, path => {
      if (path && path.length > 0) {
        this.path = path;
        this.pathIndex = 0;
      } else {
        this.path = [];
      }
    });

    this.scene.easystar.calculate();
  }

  update(time, delta) {
    if (!this.active || !this.scene) return;

    this.repathTimer += delta;
    if (this.repathTimer >= this.repathInterval) {
      this.repathTimer = 0;
      this.calculatePath();
    }

    if (!this.path || this.pathIndex >= this.path.length) {
      this.setVelocity(0, 0);
      return;
    }

    const tileSize = this.scene.tileSize;
    const nextTile = this.path[this.pathIndex];
    const targetX = nextTile.x * tileSize + tileSize / 2;
    const targetY = nextTile.y * tileSize + tileSize / 2;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 4) {
      this.pathIndex++;
      this.setVelocity(0, 0);
    } else {
      const angle = Math.atan2(dy, dx);
      this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
    }

    // Optional: trigger collision manually
    // if (this.target && Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 10) {
    //   this.onHit();
    //   this.target.destroy();
    // }
  }

  onHit() {
    dropEnergy(this.scene, this.x, this.y);
    this.destroy();
  }

}
