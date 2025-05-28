// No need to spawn items here anymore
export function initResourceSystem(scene) {
  scene.energyCores = 0;
  scene.energyItems = scene.physics.add.group();

  scene.energyText = scene.add.text(16, 16, 'Energy: 0', {
    fontSize: '20px',
    fill: '#ffffff',
    backgroundColor: '#00000088',
    padding: { x: 8, y: 4 }
  });
  scene.energyText.setScrollFactor(0);
}

// Called when a player collects an energy item
export function collectEnergy(player, energy) {
  energy.destroy();
  player.scene.energyCores += 1;
}

export function updateResourceDisplay(scene) {
  scene.energyText.setText(`Energy: ${scene.energyCores}`);
}

// 👇 New helper function to spawn energy orb
export function dropEnergy(scene, x, y) {
  const orb = scene.add.rectangle(x, y, 20, 20, 0xffff00);
  scene.energyItems.add(orb);
  scene.physics.add.existing(orb);
  orb.body.setImmovable(true);
}
