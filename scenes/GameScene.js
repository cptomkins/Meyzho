import { createForestEnvironment } from '../map/ForestMap.js';
import { spawnMonster, updateMonsters } from '../entities/Monster.js';
import { initResourceSystem, collectEnergy, updateResourceDisplay, dropEnergy } from '../systems/ResourceSystem.js';
import { deployRobot } from '../systems/RobotDeploymentSystem.js';
import Player from '../entities/Player.js';
import Robot from '../entities/Robot.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('meyzho', 'assets/character/meyzho/sprite-character-meyzho-default-v001.png');
    this.load.image('monster', 'assets/mob/sprite-mob-monsterA-default-v001.png');
    this.load.image('robot', 'assets/character/robot/sprite-robot-default-v001.png'); // 👈 add your robot asset here
  }

  create() {
    const tileSize = 64;
    const mapWidth = 20;
    const mapHeight = 15;
    const worldWidth = mapWidth * tileSize;
    const worldHeight = mapHeight * tileSize;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    this.player = new Player(this, worldWidth / 2, worldHeight / 2);
    createForestEnvironment(this);
    this.children.bringToTop(this.player);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      zoomIn: Phaser.Input.Keyboard.KeyCodes.Q,
      zoomOut: Phaser.Input.Keyboard.KeyCodes.E,
      deploy: Phaser.Input.Keyboard.KeyCodes.SPACE // 👈 launch robot with spacebar
    });

    this.monsters = this.physics.add.group();
    this.robots = this.physics.add.group();

    this.monsterSpawnTimer = 0;
    initResourceSystem(this);

    this.physics.add.overlap(this.player, this.energyItems, collectEnergy, null, this);
    this.physics.add.overlap(this.player, this.monsters, (player, monster) => {
      dropEnergy(this, monster.x, monster.y);
      monster.destroy();
    });

    this.physics.add.overlap(this.robots, this.monsters, (robot, monster) => {
      dropEnergy(this, monster.x, monster.y);
      robot.destroy();
      monster.destroy();
    });
  }

  update(time, delta) {
    this.player.move(this.cursors, delta);

    if (Phaser.Input.Keyboard.JustDown(this.cursors.deploy)) {
      deployRobot(this);
    }

    this.robots.children.iterate(robot => {
      if (robot && robot.update) robot.update();
    });

    this.monsterSpawnTimer += delta;
    if (this.monsterSpawnTimer > 3000) {
      spawnMonster(this);
      this.monsterSpawnTimer = 0;
    }

    updateMonsters(this, this.player);
    updateResourceDisplay(this);

    if (this.cursors.zoomIn.isDown) {
      const currentZoom = this.cameras.main.zoom;
      if (currentZoom < 2) this.cameras.main.setZoom(currentZoom + 0.02);
    }

    if (this.cursors.zoomOut.isDown) {
      const currentZoom = this.cameras.main.zoom;
      if (currentZoom > 0.5) this.cameras.main.setZoom(currentZoom - 0.02);
    }
  }
}
