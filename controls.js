// import Phaser from 'phaser'

import { playAudio } from './audio.js'

const MARIO_ANIMATIONS = {
  grown: {
    idle: 'mario-grown-idle',
    walk: 'mario-grown-walk',
    jump: 'mario-grown-jump'
  },
  normal: {
    idle: 'mario-idle',
    walk: 'mario-walk',
    jump: 'mario-jump'
  }
}

export function checkControls (game, velocityY) {
  const { mario, keys } = game

  const isMarioTouchingFloor = mario.body.touching.down

  const isLeftKeyDown = keys.left.isDown
  const isRightKeyDown = keys.right.isDown
  const isUpKeyDown = keys.up.isDown
  const isDownKeyDown = keys.down.isDown
  // const isEscapeKeyDown = keys.esc.isJustDown

  if (mario.isDead) return
  if (mario.isBlocked) return

  const marioAnimations = mario.isGrown
    ? MARIO_ANIMATIONS.grown
    : MARIO_ANIMATIONS.normal

  // eslint-disable-next-line no-undef
  if (Phaser.Input.Keyboard.JustDown(keys.esc)) {
    game.isPaused = !game.isPaused
    playAudio('pause', game, { volume: 0.2 })

    game.pauseOverlay.setVisible(game.isPaused)
    game.pauseMenu.setVisible(game.isPaused)
  }

  if (isLeftKeyDown) {
    isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
    mario.x -= 2
    mario.flipX = true // Voltear el sprite de Mario horizontalmente.
  } else if (isRightKeyDown) {
    isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
    mario.x += 2
    mario.flipX = false // Restaurar la orientación original del sprite de Mario.
  } else if (isMarioTouchingFloor) {
    mario.anims.play(marioAnimations.idle, true) // Reproducir la animación de inactividad.
  }

  if (isUpKeyDown && isMarioTouchingFloor) {
    playAudio('jumpsound', game, { volume: 0.1 })
    mario.setVelocityY(-300) // Aplicar una velocidad negativa en el eje Y para simular un salto.
    isDownKeyDown ? mario.setVelocityY(-velocityY / 1.25) : mario.setVelocityY(-velocityY)
    mario.anims.play(marioAnimations.jump, true) // Reproducir la animación de salto.
  }
}
