import { platformHeight, screenHeight, screenWidth, config } from '../../config/index.js'

const { bgColor } = config

export function drawStartScreen () {
  const player = this.mario.sprite
  const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2

  // Draw sky
  this.add.rectangle(0, 0, screenWidth, screenHeight, bgColor.overworld).setOrigin(0).depth = -1

  const platform = this.add.tileSprite(0, screenHeight, screenWidth / 2, platformHeight, 'start-floorbricks').setScale(2).setOrigin(0, 0.5)
  this.physics.add.existing(platform)
  platform.body.immovable = true
  platform.body.allowGravity = false
  // Apply player collision with platform
  this.physics.add.collider(player, platform)

  /*
  this.add.text(screenWidth / 2, screenHeight - (screenHeight* 0.9),
  "Known bugs: \n. Mobile controls are (at least) not nice",
  { fontFamily: 'pixel_nums', fontSize: (screenWidth / 115), align: 'left'}).setLineSpacing(screenHeight / 34.5);
  */

  this.add.image(screenWidth / 50, screenHeight / 3, 'cloud1').setScale(screenHeight / 1725)
  this.add.image(screenWidth / 1.25, screenHeight / 2, 'cloud1').setScale(screenHeight / 1725)
  this.add.image(screenWidth / 1.05, screenHeight / 6.5, 'cloud2').setScale(screenHeight / 1725)
  this.add.image(screenWidth / 3, screenHeight / 3.5, 'cloud2').setScale(screenHeight / 1725)
  this.add.image(screenWidth / 2.65, screenHeight / 2.8, 'cloud2').setScale(screenHeight / 1725)

  this.add.image(screenWidth / 50, screenHeight / 3, 'cloud1').setScale(screenHeight / 1725)

  this.add.image(screenWidth / 25, screenHeight / 10, 'sign').setOrigin(0).setScale(screenHeight / 350)

  const propsY = screenHeight - platformHeight

  this.add.image(screenWidth / 50, propsY, 'mountain2').setOrigin(0, 1).setScale(screenHeight / 517)
  this.add.image(screenWidth / 300, propsY, 'mountain1').setOrigin(0, 1).setScale(screenHeight / 517)

  this.add.image(screenWidth / 4, propsY, 'bush1').setOrigin(0, 1).setScale(screenHeight / 609)
  this.add.image(screenWidth / 1.55, propsY, 'bush2').setOrigin(0, 1).setScale(screenHeight / 609)
  this.add.image(screenWidth / 1.5, propsY, 'bush2').setOrigin(0, 1).setScale(screenHeight / 609)

  this.add.tileSprite(screenWidth / 15, propsY, 350, 35, 'fence').setOrigin(0, 1).setScale(screenHeight / 863)

  this.customBlock = this.add.sprite(screenCenterX, screenHeight - (platformHeight * 1.9), 'custom-block').setScale(screenHeight / 345)
  this.customBlock.anims.play('custom-block-default')
  this.physics.add.collider(player, this.customBlock, function () {
    // if (player.body.blocked.up) showSettings.call(this)
  }, null, this)
  this.physics.add.existing(this.customBlock)
  this.customBlock.body.allowGravity = false
  this.customBlock.body.immovable = true

  this.add.image(screenCenterX, screenHeight - (platformHeight * 1.9), 'gear')
    .setScale(screenHeight / 13000)
    .setInteractive().on('pointerdown', () =>
      // showSettings.call(this)
      console.log('pointerdown')
    )

  this.add.image(screenCenterX * 1.12, screenHeight - (platformHeight * 1.5), 'settings-bubble').setScale(screenHeight / 620)

  this.add.sprite(screenCenterX * 1.07, screenHeight - platformHeight, 'npc').setOrigin(0.5, 1).setScale(screenHeight / 365).anims.play('npc-default', true)
}
