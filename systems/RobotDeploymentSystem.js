import Robot from '../entities/Robot.js';

export function deployRobot(scene) {
  if (scene.energyCores <= 0) return;

  const robot = new Robot(scene, scene.player.x, scene.player.y);
  scene.robots.add(robot);
  scene.energyCores -= 1;
}
