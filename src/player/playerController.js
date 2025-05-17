/* global Phaser */

import { killMario } from '../game.js'
import { controlKeys, playerOptions, screenHeight, screenWidth, velocityY, worldWidth } from '../config/index.js'
import { MARIO_ANIMATIONS } from './mario_animations.js'
import { updateTimer } from '../game/ui/hudManager.js'
import { throwFireball } from './fireball.js'
import Mario from './Mario.js'

export default class PlayerController {
  constructor (scene, x, y) {
    this.scene = scene
    this.sprite = new Mario(scene, x, y)

    // this.sprite.setBounce(0)
    //   .setOrigin(1)
    //   .setCollideWorldBounds(true)
    //   .setScale(screenHeight / 345)

    // this.sprite.depth = 3
    // this.sprite.state = 2
  }

  update (delta) {
    checkControls.call(this, delta)
  }

  invulnerability (time) {
    applyPlayerInvulnerabilityFun.call(this, time)
  }

  decrease () {
    decreasePlayer.call(this)
  }
}

function decreasePlayer () {
  const game = this.scene
  const mario = this.sprite

  if (mario.state <= 0) {
    game.gameOver = true
    killMario.call(game)
    return
  }

  mario.isBlocked = true
  game.physics.pause()
  game.anims.pauseAll()
  game.powerDownSound.play()

  const anim1 = mario.state === 2 ? 'mario-fire-idle' : 'mario-grown-idle'
  const anim2 = mario.state === 2 ? 'mario-grown-idle' : 'mario-idle'

  this.invulnerability(3000)

  mario.anims.play(anim2)

  let i = 0
  const interval = setInterval(() => {
    i++
    mario.anims.play(i % 2 === 0 ? anim2 : anim1)
    if (i > 5) {
      clearInterval(interval)
    }
  }, 100)

  mario.state--

  setTimeout(() => {
    game.physics.resume()
    game.anims.resumeAll()
    mario.isBlocked = false
    updateTimer.call(game)
  }, 1000)
}

function checkControls (delta) {
  const { timeLeft } = playerOptions
  const { flagRaised, fireInCooldown } = this.scene
  const game = this.scene
  // console.log({ flagRaised })
  const mario = this.sprite

  const isMarioTouchingFloor = mario.body.touching.down

  const isLeftKeyDown = controlKeys.LEFT.isDown
  const isRightKeyDown = controlKeys.RIGHT.isDown
  // const isUpKeyDown = controlKeys.JUMP.isDown
  const isUpKeyDown = Phaser.Input.Keyboard.JustDown(controlKeys.JUMP)
  const isDownKeyDown = controlKeys.DOWN.isDown
  // const isFireKeyDown = controlKeys.FIRE.isDown
  const isFireKeyDown = Phaser.Input.Keyboard.JustDown(controlKeys.FIRE)
  const isPauseKeyDown = Phaser.Input.Keyboard.JustDown(controlKeys.PAUSE)

  if (mario.isDead) return

  const marioAnimations = MARIO_ANIMATIONS[mario.state]

  if (isPauseKeyDown) {
    const isPaused = !game.isPaused
    game.isPaused = isPaused

    game.pauseOverlay.setVisible(isPaused)
    game.pauseMenu.setVisible(isPaused)

    const musicTracks = [game.musicTheme, game.undergroundMusicTheme, game.hurryMusicTheme]
    musicTracks.forEach(track => isPaused ? track.pause() : track.resume())

    if (isPaused) {
      game.pauseSound.play()
      game.physics.world.pause()
      game.anims.pauseAll()
    } else {
      game.physics.world.resume()
      game.anims.resumeAll()
      this.levelStarted && updateTimer.call(game)
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

  if (mario.body.blocked.up) mario.jump(0)

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
    // mario.setVelocityY((mario.state > 0 && isDownKeyDown) ? -velocityY / 1.25 : -velos cityY)
    mario.jump((mario.state > 0 && isDownKeyDown) ? -velocityY / 1.25 : -velocityY)
  }

  if (isLeftKeyDown) {
    game.smoothedControls.moveLeft(delta)
    mario.moveLeft(game, marioAnimations.walk)
  } else if (isRightKeyDown) {
    game.smoothedControls.moveRight(delta)
    mario.moveRight(game, marioAnimations.walk)
  } else {
    if (mario.body.velocity.x !== 0) { game.smoothedControls.reset() }
    if (isMarioTouchingFloor) { mario.setVelocityX(0) }
    if (!(isUpKeyDown) && !mario.isFiring) {
      mario.anims.play(marioAnimations.idle, true)
    }
  }

  if (!mario.isFiring) {
    if (mario.state > 0 && isDownKeyDown) {
      mario.crouch(marioAnimations.crouch)
      if (isMarioTouchingFloor) mario.setVelocityX(0)
      return
    } else {
      mario.standUp()
    }
  }

  // if (isMarioTouchingFloor && mario.state === 2 && isFireKeyDown && !fireInCooldown) {
  if (mario.state === 2 && isFireKeyDown && !fireInCooldown) {
    throwFireball.call(this)
    return
  }

  // Apply jump animation
  if (!isMarioTouchingFloor) {
    mario.anims.play(marioAnimations.jump, true)
    // if (!playerFiring) {
    // }
  }
}

function applyPlayerInvulnerabilityFun (time) {
  const mario = this.sprite
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
