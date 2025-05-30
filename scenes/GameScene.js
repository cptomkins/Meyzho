import { createForestEnvironment } from '../map/ForestMap.js';
import { spawnMonster, updateMonsters } from '../entities/Monster.js';
import { initResourceSystem, collectEnergy, updateResourceDisplay, dropEnergy } from '../systems/ResourceSystem.js';
import Player from '../entities/Player.js';
import Robot from '../entities/Robot.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('meyzho', 'assets/character/meyzho/sprite-character-meyzho-default-v001.png');
    this.load.image('monster', 'assets/mob/sprite-mob-monsterA-default-v001.png');
    this.load.image('robot', 'assets/robot-sprite.png');
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
      robot.onHit();
      monster.destroy();
    });

    // Set up Easystar for pathfinding
    this.easystar = new window.EasyStar.js();
    this.easystar.setGrid(this.mapGrid);
    this.easystar.setAcceptableTiles([0]); // 0 means walkable in ForestMap
    this.easystar.enableDiagonals();

    // Launch a robot when spacebar is pressed
    this.input.keyboard.on('keydown-SPACE', () => {
      this.launchRobot();
    });
  }

  update(time, delta) {
    this.player.move(this.cursors, delta);

    this.monsterSpawnTimer += delta;
    if (this.monsterSpawnTimer > 3000) {
      spawnMonster(this);
      this.monsterSpawnTimer = 0;
    }

    updateMonsters(this, this.player);

    this.robots.children.iterate(robot => {
      if (!robot.active) return;

      let closestMonster = null;
      let closestDistance = Infinity;

      this.monsters.children.iterate(monster => {
        if (!monster.active) return;

        const dist = Phaser.Math.Distance.Between(robot.x, robot.y, monster.x, monster.y);
        if (dist < closestDistance) {
          closestDistance = dist;
          closestMonster = monster;
        }
      });

      if (closestMonster) {
        robot.setTarget(closestMonster);
      } else {
        robot.setTarget(null);
      }

      robot.update();
    });

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

  launchRobot() {
    const robot = new Robot(this, this.player.x, this.player.y);
    this.robots.add(robot);

    // Add forest collision for robot
    this.physics.add.collider(robot, this.forestTiles);
  }
}
