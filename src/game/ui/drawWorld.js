/* global Phaser */
import {
  platformHeight,
  playerOptions,
  screenHeight,
  screenWidth,
  worldWidth,
  config
} from '../services/config.js'
import { generateRandomCoordinate } from '../services/randomCoordinate.js'

const { bgColor } = config

export function drawWorld () {
  const { isLevelOverworld } = playerOptions
  // Drawing scenery props
  const player = this.mario

  // > Drawing the Sky
  this.add.rectangle(screenWidth, 0, worldWidth, screenHeight, isLevelOverworld ? bgColor.overworld : bgColor.underworld).setOrigin(0).depth = -1

  const propsY = screenHeight - platformHeight

  if (isLevelOverworld) {
    // > Clouds
    for (let i = 0; i < Phaser.Math.Between(Math.trunc(worldWidth / 760), Math.trunc(worldWidth / 380)); i++) {
      const x = generateRandomCoordinate(false, false)
      const y = Phaser.Math.Between(screenHeight / 80, screenHeight / 2.2)
      if (Phaser.Math.Between(0, 10) < 5) {
        this.add.image(x, y, 'cloud1').setOrigin(0).setScale(screenHeight / 1725)
      } else {
        this.add.image(x, y, 'cloud2').setOrigin(0).setScale(screenHeight / 1725)
      }
    }

    // > Mountains
    for (let i = 0; i < Phaser.Math.Between(worldWidth / 6400, worldWidth / 3800); i++) {
      const x = generateRandomCoordinate()

      if (Phaser.Math.Between(0, 10) < 5) {
        this.add.image(x, propsY, 'mountain1').setOrigin(0, 1).setScale(screenHeight / 517)
      } else {
        this.add.image(x, propsY, 'mountain2').setOrigin(0, 1).setScale(screenHeight / 517)
      }
    }

    // > Bushes
    for (let i = 0; i < Phaser.Math.Between(Math.trunc(worldWidth / 960), Math.trunc(worldWidth / 760)); i++) {
      const x = generateRandomCoordinate()

      if (Phaser.Math.Between(0, 10) < 5) {
        this.add.image(x, propsY, 'bush1').setOrigin(0, 1).setScale(screenHeight / 609)
      } else {
        this.add.image(x, propsY, 'bush2').setOrigin(0, 1).setScale(screenHeight / 609)
      }
    }

    // > Fences
    for (let i = 0; i < Phaser.Math.Between(Math.trunc(worldWidth / 4000), Math.trunc(worldWidth / 2000)); i++) {
      const x = generateRandomCoordinate()

      this.add.tileSprite(x, propsY, Phaser.Math.Between(100, 250), 35, 'fence').setOrigin(0, 1).setScale(screenHeight / 863)
    }
  }

  // > Final flag
  this.finalFlagMast = this.add.tileSprite(worldWidth - (worldWidth / 30), propsY, 16, 167, 'flag-mast').setOrigin(0, 1).setScale(screenHeight / 400)
  this.physics.add.existing(this.finalFlagMast)
  this.finalFlagMast.immovable = true
  this.finalFlagMast.allowGravity = false
  this.finalFlagMast.body.setSize(3, 167)
  this.physics.add.overlap(player, this.finalFlagMast, null, playerOptions.raiseFlag, this)
  this.physics.add.collider(this.platformGroup.getChildren(), this.finalFlagMast)

  // > Flag
  this.finalFlag = this.add.image(worldWidth - (worldWidth / 30), propsY * 0.93, 'final-flag').setOrigin(0.5, 1)
  this.finalFlag.setScale(screenHeight / 400)

  // > Castle
  this.add.image(worldWidth - (worldWidth / 75), propsY, 'castle').setOrigin(0.5, 1).setScale(screenHeight / 300)
}
