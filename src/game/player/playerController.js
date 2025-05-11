/* global Phaser */

import { killMario } from '../../game.js'
import { controlKeys, platformHeight, playerOptions, screenHeight, screenWidth, startOffset, velocityY, worldWidth } from '../services/config.js'
import { MARIO_ANIMATIONS } from '../services/mario_animations.js'

export function createPlayer () {
  this.mario = this.physics.add
    .sprite(startOffset, screenHeight - platformHeight, 'mario')
    .setOrigin(1)
    .setBounce(0)
    .setCollideWorldBounds(true) // Evitar que Mario salga de los límites del mundo del juego.
    .setScale(screenHeight / 376)
  this.mario.depth = 3
  // this.mario.state = 1
}

export function checkControls (delta) {
  const { playerController, timeLeft } = playerOptions
  const { mario, flagRaised, playerFiring, fireInCooldown } = this

  const isMarioTouchingFloor = mario.body.touching.down

  const isLeftKeyDown = controlKeys.LEFT.isDown
  const isRightKeyDown = controlKeys.RIGHT.isDown
  const isUpKeyDown = controlKeys.JUMP.isDown
  const isDownKeyDown = controlKeys.DOWN.isDown
  const isFireKeyDown = controlKeys.FIRE.isDown

  if (mario.isDead) return

  const marioAnimations = MARIO_ANIMATIONS[mario.state]

  if (Phaser.Input.Keyboard.JustDown(controlKeys.PAUSE)) {
    this.isPaused = !this.isPaused

    this.pauseOverlay.setVisible(this.isPaused)
    this.pauseMenu.setVisible(this.isPaused)

    const camera = this.cameras.main
    // Pausar el juego si se presiona la tecla Escape.
    if (this.isPaused) {
      this.musicTheme.pause()
      this.pauseSound.play()
      this.pauseOverlay.setPosition(camera.scrollX, camera.scrollY)
      this.pauseMenu.setPosition(camera.scrollX + (camera.width / 2), this.pauseMenu.y)
      this.physics.world.pause()
      this.anims.pauseAll()
    } else {
      this.musicTheme.resume()
      this.physics.world.resume()
      this.anims.resumeAll()
    }
  }

  if (mario.isBlocked && flagRaised) {
    mario.setVelocityX(screenWidth / 8.5)
    mario.anims.play(marioAnimations.walk, true).flipX = false

    if (mario.x >= worldWidth - (worldWidth / 75)) {
      this.tweens.add({
        targets: mario,
        duration: 75,
        alpha: 0
      })
    }
    setTimeout(() => {
      this.gameWinned = true
      mario.destroy()
      // winScreen.call(this);
    }, 5000)
    return
  }

  if (mario.body.blocked.up) { mario.setVelocityY(0) }

  if (mario.body.blocked.left || mario.body.blocked.right) {
    mario.setVelocityX(0)
  }

  // Check if player has fallen
  if (mario.y > screenHeight - 10 || timeLeft <= 0) {
    this.gameOver = true
    killMario.call(this)
    // gameOverFunc.call(this);
    return
  }

  if (mario.isBlocked) return

  if (isUpKeyDown && isMarioTouchingFloor) {
    this.jumpSound.play()
    mario.setVelocityY((mario.state > 0 && isDownKeyDown) ? -velocityY / 1.25 : -velocityY)
  }

  // > Horizontal movement and animations
  let oldVelocityX
  let targetVelocityX
  let newVelocityX

  if (isLeftKeyDown) {
    this.smoothedControls.moveLeft(delta)
    if (!playerFiring) {
      mario.anims.play(marioAnimations.walk, true).flipX = true
    }

    playerController.direction.positive = false

    // Lerp the velocity towards the max run using the smoothed controls.
    // This simulates a player controlled acceleration.
    oldVelocityX = mario.body.velocity.x
    targetVelocityX = -playerController.speed.run
    newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -this.smoothedControls.value)

    mario.setVelocityX(newVelocityX)
  } else if (isRightKeyDown) {
    this.smoothedControls.moveRight(delta)
    if (!playerFiring) {
      mario.anims.play(marioAnimations.walk, true).flipX = false
    }

    playerController.direction.positive = true

    // Lerp the velocity towards the max run using the smoothed controls.
    // This simulates a player controlled acceleration.
    oldVelocityX = mario.body.velocity.x
    targetVelocityX = playerController.speed.run
    newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, this.smoothedControls.value)

    mario.setVelocityX(newVelocityX)
  } else {
    if (mario.body.velocity.x !== 0) { this.smoothedControls.reset() }
    if (isMarioTouchingFloor) { mario.setVelocityX(0) }
    if (!(isUpKeyDown) && !playerFiring) {
      mario.anims.play(marioAnimations.idle, true)
    }
  }

  if (!playerFiring) {
    if (mario.state > 0 && isDownKeyDown) {
      mario.anims.play(marioAnimations.crouch, true)

      if (isMarioTouchingFloor) {
        mario.setVelocityX(0)
      }

      mario.body.setSize(14, 22).setOffset(2, 10)

      return
    } else {
      if (mario.state > 0) { mario.body.setSize(14, 32).setOffset(2, 0) }

      if (mario.state === 0) { mario.body.setSize(14, 16).setOffset(1.3, 0.5) }
    }
  }

  if (isMarioTouchingFloor && mario.state === 2 && isFireKeyDown && !fireInCooldown) {
    // throwFireball.call(this)
    return
  }

  // Apply jump animation
  if (!isMarioTouchingFloor) {
    if (!playerFiring) {
      mario.anims.play(marioAnimations.jump, true)
    }
  }
}

export function applyPlayerInvulnerability (time) {
  const { mario } = this
  const blinkAnim = this.tweens.add({
    targets: mario,
    duration: 100,
    alpha: { from: 1, to: 0.2 },
    ease: 'Linear',
    repeat: -1,
    yoyo: true
  })

  mario.isInvulnerable = true
  setTimeout(() => {
    mario.isInvulnerable = false
    blinkAnim.stop()
    mario.alpha = 1
  }, time)
}
