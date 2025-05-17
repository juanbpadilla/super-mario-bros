/* global Phaser */

import { playerOptions, screenHeight } from '../config/index.js'

export default class Mario extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'mario')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setBounce(0)
      .setOrigin(1)
      .setCollideWorldBounds(true)
      .setScale(screenHeight / 376)
    // ...otras propiedades...
    this.state = 2
    this.depth = 3
    this.isDead = false
    this.isBlocked = false
    this.isFiring = false
  }

  jump (velocity) {
    this.setVelocityY(velocity)
  }

  moveLeft (game, anim) {
    if (!this.isFiring) this.playAnimation(anim, true)

    playerOptions.playerController.direction.positive = false

    const oldVelocityX = this.body.velocity.x
    const targetVelocityX = -playerOptions.playerController.speed.run
    const newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -game.smoothedControls.value)

    this.setVelocityX(newVelocityX)
  }

  moveRight (game, anim) {
    if (!this.isFiring) this.playAnimation(anim, false)

    playerOptions.playerController.direction.positive = true

    const oldVelocityX = this.body.velocity.x
    const targetVelocityX = playerOptions.playerController.speed.run
    const newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, game.smoothedControls.value)

    this.setVelocityX(newVelocityX)
  }

  crouch (anim) {
    this.anims.play(anim, true)
    this.body.setSize(14, 22).setOffset(2, 10)
  }

  standUp () {
    if (this.state > 0) this.body.setSize(14, 32).setOffset(2, 0)
    if (this.state === 0) this.body.setSize(14, 16).setOffset(1.3, 0.5)
  }

  playAnimation (anim, flipX = false) {
    this.anims.play(anim, true)
    this.flipX = flipX
  }
}
