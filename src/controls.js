/* eslint-disable no-undef */
// import Phaser from 'phaser'

import { playAudio } from './audio.js'
import { playerOptions, screenHeight, screenWidth, velocityY, worldWidth } from './game/services/config.js'

const MARIO_ANIMATIONS = [
  {
    idle: 'mario-idle',
    walk: 'mario-walk',
    jump: 'mario-jump',
    crouch: '',
    throw: '',
  },
  {
    idle: 'mario-grown-idle',
    walk: 'mario-grown-walk',
    jump: 'mario-grown-jump',
    crouch: 'mario-grown-crouch',
    throw: '',
  },
  {
    idle: 'mario-fire-idle',
    walk: 'mario-fire-walk',
    jump: 'mario-fire-jump',
    crouch: 'mario-fire-crouch',
    throw: 'mario-fire-throw',
  },
]

export function checkControls (game, delta) {
  const { mario, keys } = game

  const isMarioTouchingFloor = mario.body.touching.down

  const isLeftKeyDown = keys.left.isDown
  const isRightKeyDown = keys.right.isDown
  const isUpKeyDown = keys.up.isDown
  const isDownKeyDown = keys.down.isDown
  // const isEscapeKeyDown = keys.esc.isJustDown

  if (mario.isDead) return
  if (mario.isBlocked) return

  // const marioAnimations = mario.isGrown
  //   ? MARIO_ANIMATIONS.grown
  //   : MARIO_ANIMATIONS.normal

  const marioAnimations = MARIO_ANIMATIONS[mario.state]

  if (Phaser.Input.Keyboard.JustDown(keys.esc)) {
    game.isPaused = !game.isPaused
    playAudio('pause', game, { volume: 0.2 })

    game.pauseOverlay.setVisible(game.isPaused)
    game.pauseMenu.setVisible(game.isPaused)
    console.log(mario)
  }

  if (playerOptions.playerBlocked && playerOptions.flagRaised) {
    mario.setVelocityX(screenWidth / 8.5)
    mario.anims.play(marioAnimations.walk, true).flipX = false
    // if (playerOptions.playerState === 0) { mario.anims.play(marioAnimations.walk, true).flipX = false }
    // if (playerOptions.playerState === 1) { mario.anims.play(marioAnimations.walk, true).flipX = false }
    // if (playerOptions.playerState === 2) { mario.anims.play(marioAnimations.walk, true) }

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
  if (mario.y > screenHeight - 10 || playerOptions.timeLeft <= 0) {
    game.gameOver = true
    // gameOverFunc.call(this);
    return
  }

  if (playerOptions.playerBlocked) { return }

  // if (isLeftKeyDown) {
  //   isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
  //   mario.x -= 2
  //   mario.flipX = true // Voltear el sprite de Mario horizontalmente.
  // } else if (isRightKeyDown) {
  //   isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
  //   mario.x += 2
  //   mario.flipX = false // Restaurar la orientación original del sprite de Mario.
  // } else if (isMarioTouchingFloor) {
  //   mario.anims.play(marioAnimations.idle, true) // Reproducir la animación de inactividad.
  // }

  if (isUpKeyDown && isMarioTouchingFloor) {
    playAudio('jumpsound', game, { volume: 0.1 })
    // mario.setVelocityY(-300); // Aplicar una velocidad negativa en el eje Y para simular un salto.
    mario.setVelocityY((playerOptions.playerState > 0 && isDownKeyDown) ? -velocityY / 1.25 : -velocityY)
    // isDownKeyDown ? mario.setVelocityY(-velocityY / 1.25) : mario.setVelocityY(-velocityY)
    // mario.anims.play(marioAnimations.jump, true) // Reproducir la animación de salto.
  }

  // > Horizontal movement and animations
  let oldVelocityX
  let targetVelocityX
  let newVelocityX

  if (isLeftKeyDown) {
    game.smoothedControls.moveLeft(delta)
    if (!playerOptions.playerFiring) {
      mario.anims.play(marioAnimations.walk, true).flipX = true
      // if (playerOptions.playerState === 0) { mario.anims.play(marioAnimations.walk, true).flipX = true }

      // if (playerOptions.playerState === 1) { mario.anims.play(marioAnimations.walk, true).flipX = true }

      // if (playerOptions.playerState === 2) { mario.anims.play(marioAnimations.walk, true).flipX = true }
    }

    playerOptions.playerController.direction.positive = false

    // Lerp the velocity towards the max run using the smoothed controls.
    // This simulates a player controlled acceleration.
    oldVelocityX = mario.body.velocity.x
    targetVelocityX = -playerOptions.playerController.speed.run
    newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -game.smoothedControls.value)

    mario.setVelocityX(newVelocityX)
  } else if (isRightKeyDown) {
    game.smoothedControls.moveRight(delta)
    if (!playerOptions.playerFiring) {
      mario.anims.play(marioAnimations.walk, true).flipX = false
      // if (playerOptions.playerState === 0) { mario.anims.play(marioAnimations.walk, true).flipX = false }

      // if (playerOptions.playerState === 1) { mario.anims.play(marioAnimations.walk, true).flipX = false }

      // if (playerOptions.playerState === 2) { mario.anims.play(marioAnimations.walk, true).flipX = false }
    }

    playerOptions.playerController.direction.positive = true

    // Lerp the velocity towards the max run using the smoothed controls.
    // This simulates a player controlled acceleration.
    oldVelocityX = mario.body.velocity.x
    targetVelocityX = playerOptions.playerController.speed.run
    newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, game.smoothedControls.value)

    mario.setVelocityX(newVelocityX)
  } else {
    if (mario.body.velocity.x !== 0) { game.smoothedControls.reset() }
    if (isMarioTouchingFloor) { mario.setVelocityX(0) }
    if (!(isUpKeyDown) && !playerOptions.playerFiring) {
      mario.anims.play(marioAnimations.idle, true)
      // if (playerOptions.playerState === 0) { mario.anims.play(marioAnimations.idle, true) }

      // if (playerOptions.playerState === 1) { mario.anims.play(marioAnimations.idle, true) }

      // if (playerOptions.playerState === 2) { mario.anims.play(marioAnimations.idle, true) }
    }
  }

  if (!playerOptions.playerFiring) {
    if (playerOptions.playerState > 0 && isDownKeyDown) {
      mario.anims.play(marioAnimations.crouch, true)
      // if (playerOptions.playerState === 1) { mario.anims.play('grown-mario-crouch', true) }

      // if (playerOptions.playerState === 2) { mario.anims.play('fire-mario-crouch', true) }

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

  // if (playerOptions.playerState > 0) { mario.body.setSize(14, 32).setOffset(2, 0) }

  // if (playerOptions.playerState === 0) { mario.body.setSize(14, 16).setOffset(1.3, 0.5) }
  // if (isMarioTouchingFloor && playerOptions.playerState === 2 && controlKeys.FIRE.isDown && !fireInCooldown) {
  //   throwFireball.call(this);
  //   return;
  // }

  // Apply jump animation
  if (!isMarioTouchingFloor) {
    if (!playerOptions.playerFiring) {
      mario.anims.play(marioAnimations.jump, true)
      // if (playerOptions.playerState === 0) { mario.anims.play(marioAnimations.jump, true) }

      // if (playerOptions.playerState === 1) { mario.anims.play(marioAnimations.jump, true) }

      // if (playerOptions.playerState === 2) { mario.anims.play(marioAnimations.jump, true) }
    }
  }
}
