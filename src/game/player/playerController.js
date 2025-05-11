/* global Phaser */

import { killMario } from '../../game.js'
import { controlKeys, playerOptions, screenHeight, screenWidth, velocityY, worldWidth } from '../services/config.js'
import { MARIO_ANIMATIONS } from '../services/mario_animations.js'

export default class PlayerController {
  constructor (scene, x, y) {
    this.scene = scene

    this.sprite = scene.physics.add.sprite(x, y, 'mario')

    this.sprite.setBounce(0)
      .setOrigin(1)
      .setCollideWorldBounds(true)
      .setScale(screenHeight / 376)

    this.sprite.depth = 3
  }

  update (delta) {
    checkControls.call(this, delta)
  }

  invulnerability (time) {
    applyPlayerInvulnerabilityFun.call(this, time)
  }
}

function checkControls (delta) {
  const { playerController, timeLeft } = playerOptions
  const { flagRaised, playerFiring, fireInCooldown } = this.scene
  const game = this.scene
  // console.log({ flagRaised })
  const mario = this.sprite

  const isMarioTouchingFloor = mario.body.touching.down

  const isLeftKeyDown = controlKeys.LEFT.isDown
  const isRightKeyDown = controlKeys.RIGHT.isDown
  const isUpKeyDown = controlKeys.JUMP.isDown
  const isDownKeyDown = controlKeys.DOWN.isDown
  const isFireKeyDown = controlKeys.FIRE.isDown

  if (mario.isDead) return

  const marioAnimations = MARIO_ANIMATIONS[mario.state]

  if (Phaser.Input.Keyboard.JustDown(controlKeys.PAUSE)) {
    game.isPaused = !game.isPaused

    game.pauseOverlay.setVisible(game.isPaused)
    game.pauseMenu.setVisible(game.isPaused)

    const camera = game.cameras.main
    // Pausar el juego si se presiona la tecla Escape.
    if (game.isPaused) {
      game.musicTheme.pause()
      game.pauseSound.play()
      game.pauseOverlay.setPosition(camera.scrollX, camera.scrollY)
      game.pauseMenu.setPosition(camera.scrollX + (camera.width / 2), game.pauseMenu.y)
      game.physics.world.pause()
      game.anims.pauseAll()
    } else {
      game.musicTheme.resume()
      game.physics.world.resume()
      game.anims.resumeAll()
    }
  }

  if (mario.isBlocked && flagRaised) {
    mario.setVelocityX(screenWidth / 8.5)
    mario.anims.play(marioAnimations.walk, true).flipX = false

    if (mario.x >= worldWidth - (worldWidth / 75)) {
      game.tweens.add({
        targets: mario,
        duration: 75,
        alpha: 0
      })
    }
    setTimeout(() => {
      game.gameWinned = true
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
    game.gameOver = true
    killMario.call(game)
    // gameOverFunc.call(this);
    return
  }

  if (mario.isBlocked) return

  if (isUpKeyDown && isMarioTouchingFloor) {
    game.jumpSound.play()
    mario.setVelocityY((mario.state > 0 && isDownKeyDown) ? -velocityY / 1.25 : -velocityY)
  }

  // > Horizontal movement and animations
  let oldVelocityX
  let targetVelocityX
  let newVelocityX

  if (isLeftKeyDown) {
    game.smoothedControls.moveLeft(delta)
    if (!playerFiring) {
      mario.anims.play(marioAnimations.walk, true).flipX = true
    }

    playerController.direction.positive = false

    // Lerp the velocity towards the max run using the smoothed controls.
    // This simulates a player controlled acceleration.
    oldVelocityX = mario.body.velocity.x
    targetVelocityX = -playerController.speed.run
    newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -game.smoothedControls.value)

    mario.setVelocityX(newVelocityX)
  } else if (isRightKeyDown) {
    game.smoothedControls.moveRight(delta)
    if (!playerFiring) {
      mario.anims.play(marioAnimations.walk, true).flipX = false
    }

    playerController.direction.positive = true

    // Lerp the velocity towards the max run using the smoothed controls.
    // This simulates a player controlled acceleration.
    oldVelocityX = mario.body.velocity.x
    targetVelocityX = playerController.speed.run
    newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, game.smoothedControls.value)

    mario.setVelocityX(newVelocityX)
  } else {
    if (mario.body.velocity.x !== 0) { game.smoothedControls.reset() }
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

function applyPlayerInvulnerabilityFun (time) {
  const mario = this.sprite
  console.log(mario)
  const blinkAnim = this.scene.tweens.add({
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
