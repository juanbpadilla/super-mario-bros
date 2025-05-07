export function drawStartScreen () {
  const player = this.mario
  const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2

  // Draw sky
  this.add.rectangle(0, 0, this.screenWidth, this.screenHeight, 0x049cd8).setOrigin(0).depth = -1

  const platform = this.add.tileSprite(0, this.screenHeight, this.screenWidth / 2, this.platformHeight, 'start-floorbricks').setScale(2).setOrigin(0, 0.5)
  this.physics.add.existing(platform)
  platform.body.immovable = true
  platform.body.allowGravity = false
  // Apply player collision with platform
  this.physics.add.collider(player, platform)

  /*
  this.add.text(this.screenWidth / 2, this.screenHeight - (this.screenHeight* 0.9),
  "Known bugs: \n. Mobile controls are (at least) not nice",
  { fontFamily: 'pixel_nums', fontSize: (this.screenWidth / 115), align: 'left'}).setLineSpacing(this.screenHeight / 34.5);
  */

  this.add.image(this.screenWidth / 50, this.screenHeight / 3, 'cloud1').setScale(this.screenHeight / 1725)
  this.add.image(this.screenWidth / 1.25, this.screenHeight / 2, 'cloud1').setScale(this.screenHeight / 1725)
  this.add.image(this.screenWidth / 1.05, this.screenHeight / 6.5, 'cloud2').setScale(this.screenHeight / 1725)
  this.add.image(this.screenWidth / 3, this.screenHeight / 3.5, 'cloud2').setScale(this.screenHeight / 1725)
  this.add.image(this.screenWidth / 2.65, this.screenHeight / 2.8, 'cloud2').setScale(this.screenHeight / 1725)

  this.add.image(this.screenWidth / 50, this.screenHeight / 3, 'cloud1').setScale(this.screenHeight / 1725)

  this.add.image(this.screenWidth / 25, this.screenHeight / 10, 'sign').setOrigin(0).setScale(this.screenHeight / 350)

  const propsY = this.screenHeight - this.platformHeight

  this.add.image(this.screenWidth / 50, propsY, 'mountain2').setOrigin(0, 1).setScale(this.screenHeight / 517)
  this.add.image(this.screenWidth / 300, propsY, 'mountain1').setOrigin(0, 1).setScale(this.screenHeight / 517)

  this.add.image(this.screenWidth / 4, propsY, 'bush1').setOrigin(0, 1).setScale(this.screenHeight / 609)
  this.add.image(this.screenWidth / 1.55, propsY, 'bush2').setOrigin(0, 1).setScale(this.screenHeight / 609)
  this.add.image(this.screenWidth / 1.5, propsY, 'bush2').setOrigin(0, 1).setScale(this.screenHeight / 609)

  this.add.tileSprite(this.screenWidth / 15, propsY, 350, 35, 'fence').setOrigin(0, 1).setScale(this.screenHeight / 863)

  this.customBlock = this.add.sprite(screenCenterX, this.screenHeight - (this.platformHeight * 1.9), 'custom-block').setScale(this.screenHeight / 345)
  this.customBlock.anims.play('custom-block-default')
  this.physics.add.collider(player, this.customBlock, function () {
    // if (player.body.blocked.up) showSettings.call(this)
  }, null, this)
  this.physics.add.existing(this.customBlock)
  this.customBlock.body.allowGravity = false
  this.customBlock.body.immovable = true

  this.add.image(screenCenterX, this.screenHeight - (this.platformHeight * 1.9), 'gear')
    .setScale(this.screenHeight / 13000)
    .setInteractive().on('pointerdown', () =>
      // showSettings.call(this)
      console.log('pointerdown')
    )

  this.add.image(screenCenterX * 1.12, this.screenHeight - (this.platformHeight * 1.5), 'settings-bubble').setScale(this.screenHeight / 620)

  this.add.sprite(screenCenterX * 1.07, this.screenHeight - this.platformHeight, 'npc').setOrigin(0.5, 1).setScale(this.screenHeight / 365).anims.play('npc-default', true)
}
