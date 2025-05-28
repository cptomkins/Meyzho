export function createForestEnvironment(scene) {
  const tileSize = 64;

  const forestMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];


  scene.forestTiles = scene.physics.add.staticGroup();

  for (let row = 0; row < forestMap.length; row++) {
    for (let col = 0; col < forestMap[row].length; col++) {
      const x = col * tileSize + tileSize / 2;
      const y = row * tileSize + tileSize / 2;

      if (forestMap[row][col] === 1) {
        const tile = scene.add.rectangle(x, y, tileSize, tileSize, 0x2d5a2d);
        scene.forestTiles.add(tile);
        scene.physics.add.existing(tile, true); // Add static physics body
      } else {
        scene.add.rectangle(x, y, tileSize, tileSize, 0x6b8e6b);
      }
    }
  }

  // Set up collision between player and trees
  scene.physics.add.collider(scene.player, scene.forestTiles);
}
