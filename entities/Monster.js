export function spawnMonster(scene) {
  const x = Phaser.Math.Between(0, scene.physics.world.bounds.width);
  const y = Phaser.Math.Between(0, scene.physics.world.bounds.height);

  const monster = scene.physics.add.sprite(x, y, 'monster');
  scene.monsters.add(monster);
}

export function updateMonsters(scene, player) {
  scene.monsters.children.iterate(monster => {
    if (!monster || !player) return;

    const dx = player.x - monster.x;
    const dy = player.y - monster.y;
    const length = Math.hypot(dx, dy);

    if (length > 0) {
      const speed = 100;
      monster.setVelocity((dx / length) * speed, (dy / length) * speed);
    }
  });
}
