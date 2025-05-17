// let isLevelOverworld
// isLevelOverworld = Phaser.Math.Between(0, 100) <= 84;
// isLevelOverworld = true

import { playerOptions } from '../config/index.js'

// const levelStyle = isLevelOverworld ? 'overworld' : 'underground'
// const levelStyle = 'overworld'

export const initSpriteSheet = ({ load }) => {
  const { levelStyle } = playerOptions
  const INIT_SPRITESHEET = [
    {
      key: 'mario',
      path: 'assets/entities/mario.png',
      frameWidth: 18,
      frameHeight: 16
    },
    {
      key: 'mario-grown',
      path: 'assets/entities/mario-grown.png',
      frameWidth: 18,
      frameHeight: 32
    },
    {
      key: 'mario-fire',
      path: 'assets/entities/mario-fire.png',
      frameWidth: 18,
      frameHeight: 32
    },
    {
      key: 'goomba',
      path: 'assets/entities/overworld/goomba.png',
      frameWidth: 16,
      frameHeight: 16
    },
    {
      key: 'koopa',
      path: 'assets/entities/koopa.png',
      frameWidth: 16,
      frameHeight: 24
    },
    {
      key: 'shell',
      path: 'assets/entities/shell.png',
      frameWidth: 16,
      frameHeight: 15
    },
    {
      key: 'fireball',
      path: 'assets/entities/fireball.png',
      frameWidth: 8,
      frameHeight: 8
    },
    {
      key: 'fireball-explosion',
      path: 'assets/entities/fireball-explosion.png',
      frameWidth: 16,
      frameHeight: 16
    },
    {
      key: 'coin',
      path: 'assets/collectibles/coin.png',
      frameWidth: 16,
      frameHeight: 16
    },
    {
      key: 'npc',
      path: 'assets/hud/npc.png',
      frameWidth: 16,
      frameHeight: 24
    },
    {
      key: 'brick-debris',
      path: 'assets/blocks/' + levelStyle + '/brick-debris.png',
      frameWidth: 8,
      frameHeight: 8
    },
    {
      key: 'mistery-block',
      path: 'assets/blocks/' + levelStyle + '/misteryBlock.png',
      frameWidth: 16,
      frameHeight: 16
    },
    {
      key: 'custom-block',
      path: 'assets/blocks/overworld/customBlock.png',
      frameWidth: 16,
      frameHeight: 16
    },
    {
      key: 'ground-coin',
      path: 'assets/collectibles/underground/ground-coin.png',
      frameWidth: 10,
      frameHeight: 14
    },
    {
      key: 'fire-flower',
      path: 'assets/collectibles/' + levelStyle + '/fire-flower.png',
      frameWidth: 16,
      frameHeight: 16
    },
  ]
  INIT_SPRITESHEET.forEach(({ key, path, frameWidth, frameHeight }) => {
    load.spritesheet(key, path, { frameWidth, frameHeight })
  })
}

// this.load.image('cloud1', 'assets/scenery/overworld/cloud1.png')
export const initImages = ({ load }) => {
  const { levelStyle } = playerOptions
  const INIT_IMAGES = [
    { key: 'floorbricks', path: 'assets/scenery/' + levelStyle + '/floorbricks.png' },
    { key: 'supermushroom', path: 'assets/collectibles/super-mushroom.png' },
    // Load props
    { key: 'cloud1', path: 'assets/scenery/overworld/cloud1.png' },
    { key: 'cloud2', path: 'assets/scenery/overworld/cloud2.png' },
    { key: 'mountain1', path: 'assets/scenery/overworld/mountain1.png' },
    { key: 'mountain2', path: 'assets/scenery/overworld/mountain2.png' },
    { key: 'fence', path: 'assets/scenery/overworld/fence.png' },
    { key: 'bush1', path: 'assets/scenery/overworld/bush1.png' },
    { key: 'bush2', path: 'assets/scenery/overworld/bush2.png' },
    { key: 'castle', path: 'assets/scenery/castle.png' },
    { key: 'flag-mast', path: 'assets/scenery/flag-mast.png' },
    { key: 'final-flag', path: 'assets/scenery/final-flag.png' },
    { key: 'sign', path: 'assets/scenery/sign.png' },
    // Load tubes
    { key: 'horizontal-tube', path: 'assets/scenery/horizontal-tube.png' },
    { key: 'horizontal-final-tube', path: 'assets/scenery/horizontal-final-tube.png' },
    { key: 'vertical-extralarge-tube', path: 'assets/scenery/vertical-large-tube.png' },
    { key: 'vertical-small-tube', path: 'assets/scenery/vertical-small-tube.png' },
    { key: 'vertical-medium-tube', path: 'assets/scenery/vertical-medium-tube.png' },
    { key: 'vertical-large-tube', path: 'assets/scenery/vertical-large-tube.png' },
    // Load HUD images
    { key: 'gear', path: 'assets/hud/gear.png' },
    { key: 'settings-bubble', path: 'assets/hud/settings-bubble.png' },
    // Load platform bricks and structures
    { key: 'start-floorbricks', path: 'assets/scenery/overworld/floorbricks.png' },
    { key: 'block', path: 'assets/blocks/' + levelStyle + '/block.png' },
    { key: 'block2', path: 'assets/blocks/underground/block2.png' },
    { key: 'emptyBlock', path: 'assets/blocks/' + levelStyle + '/emptyBlock.png' },
    { key: 'immovableBlock', path: 'assets/blocks/' + levelStyle + '/immovableBlock.png' },
    { key: 'live-mushroom', path: 'assets/collectibles/live-mushroom.png' },
  ]

  INIT_IMAGES.forEach(({ key, path }) => {
    load.image(key, path)
  })
}
