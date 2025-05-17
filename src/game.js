/* global Phaser */

import { createAnimations } from './animations.js' // Importar la función createAnimations desde el archivo animations.js.
import { initAudio, initSounds } from './audio.js'
import PlayerController from './game/player/playerController.js'
import { drawStartScreen } from './game/ui/drawStartScreen.js'
import { getTextStyle, levelGravity, platformHeight, playerOptions, screenHeight, screenWidth, startOffset, velocityX, velocityY, worldWidth } from './game/services/config.js'
import { generateLevel } from './game/ui/generateLevel.js'
import { initImages, initSpriteSheet } from './spritesheet.js'
import { createControls } from './game/services/controls.js'
import { drawWorld } from './game/ui/drawWorld.js'
import { createEnemies } from './game/ui/enemies-control.js'
import { MARIO_ANIMATIONS } from './game/services/mario_animations.js'
import { addToScore, updateTimer } from './game/ui/hudManager.js'

const loadingGif = document.querySelectorAll('.loading-gif')

const config = {
  autofocus: false,
  type: Phaser.AUTO, // Tipo de renderizado (WebGL o Canvas) especificado automáticamente por Phaser.
  width: screenWidth,
  height: screenHeight,
  backgroundColor: 0x00000,
  parent: 'game', // ID del elemento HTML donde se renderizará el juego.
  preserveDrawingBuffer: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: levelGravity },
      debug: false,
    },
  },
  scene: {
    preload, // Método para cargar recursos antes de iniciar el juego.
    create, // Método para crear los elementos del juego. (se ejecuta una vez al inicio).
    update, // Método que se ejecuta en cada frame del juego.
  },
}

// eslint-disable-next-line no-new
new Phaser.Game(config)

const SmoothedHorionztalControl = new Phaser.Class({

  initialize:

    function SmoothedHorionztalControl (speed) {
      this.msSpeed = speed
      this.value = 0
    },

  moveLeft: function (delta) {
    if (this.value > 0) { this.reset() }
    this.value -= this.msSpeed * 3.5
    if (this.value < -1) { this.value = -1 }
    playerOptions.playerController.time.rightDown += delta
  },

  moveRight: function (delta) {
    if (this.value < 0) { this.reset() }
    this.value += this.msSpeed * 3.5
    if (this.value > 1) { this.value = 1 }
    playerOptions.playerController.time.leftDown += delta
  },

  reset: function () {
    this.value = 0
  }
})

function preload () {
  const progressBox = this.add.graphics()
  const progressBar = this.add.graphics()
  progressBox.fillStyle(0x222222, 1)
  progressBox.fillRoundedRect(screenWidth / 2.48, screenHeight / 2 * 1.05, screenWidth / 5.3, screenHeight / 20.7, 10)

  const width = this.cameras.main.width
  const height = this.cameras.main.height

  const percentText = this.make.text({
    x: width / 2,
    y: height / 2 * 1.25,
    text: '0%',
    style: getTextStyle({ color: '#ffffff' })
  })
  percentText.setOrigin(0.5, 0.5)

  this.load.on('progress', function (value) {
    percentText.setText(value * 99 >= 99 ? 'Generating world...' : 'Loading... ' + parseInt(value * 99) + '%')
    progressBar.clear()
    progressBar.fillStyle(0xffffff, 1)
    progressBar.fillRoundedRect(screenWidth / 2.45, screenHeight / 2 * 1.07, screenWidth / 5.6 * value, screenHeight / 34.5, 5)
  })

  this.load.on('complete', function () {
    progressBar.destroy()
    progressBox.destroy()
    percentText.destroy()
    loadingGif.forEach(gif => { gif.style.display = 'none' })
  })
  // Load Fonts
  this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml')

  playerOptions.setLevel(Phaser.Math.Between(0, 100) <= 84)
  playerOptions.setLevelStyle()

  initImages(this)
  initSpriteSheet(this)
  initAudio(this)
}

function create () {
  playerOptions.playerController = {
    time: {
      leftDown: 0,
      rightDown: 0
    },
    direction: {
      positive: true
    },
    speed: {
      run: velocityX,
    }
  }

  this.flagRaised = false
  this.playerFiring = false
  this.fireInCooldown = false
  this.furthestPlayerPos = 0
  this.levelStarted = false
  this.reachedLevelEnd = false
  this.gameWinned = false
  this.gameOver = false

  this.physics.world.setBounds(0, 0, worldWidth, screenHeight) // Establecer los límites del mundo del juego.

  this.cameras.main.setBounds(0, 0, worldWidth, screenHeight) // Establecer los límites de la cámara.
  this.cameras.main.isFollowing = false

  initSounds(this)

  createAnimations.call(this) // Crear las animaciones de Mario.
  this.mario = new PlayerController(this, startOffset, screenHeight - platformHeight)
  generateLevel.call(this)
  drawWorld.call(this)
  drawStartScreen.call(this)
  createEnemies.call(this)

  createControls.call(this)

  this.isPaused = false

  this.pauseOverlay = this.add.rectangle(0, 0, config.width, config.height, 0x000000, 0.3)
  this.pauseOverlay.setOrigin(0, 0)
  this.pauseOverlay.setScrollFactor(0)
  this.pauseOverlay.setVisible(this.isPaused)
    .depth = 6

  const textStyle = getTextStyle({ fontSize: config.width / 20, align: 'center' })
  this.pauseMenu = this.add.text(config.width / 2, config.height / 2, 'PAUSED', textStyle)
    .setOrigin(0.5, 0.5)
    .setVisible(this.isPaused) // Crear el menú de pausa y ocultarlo inicialmente.
    .setScrollFactor(0)
  this.pauseMenu.depth = 6
  console.log(playerOptions.levelStyle)

  this.smoothedControls = new SmoothedHorionztalControl(0.001)
}

export function collectItem (mario, item) {
  const { texture: { key } } = item

  if (key === 'coin' || key === 'ground-coin') {
    this.coinSound.play()
    addToScore.call(this, 200)
    item.destroy()
    return
  } else if (key === 'supermushroom') {
    this.consumePowerUpSound.play()
    addToScore.call(this, 1000, item)
    item.destroy()
    if (mario.state > 0) return
  } else if (key === 'fire-flower') {
    this.consumePowerUpSound.play()
    addToScore.call(this, 1000, item)
    item.destroy()
    if (mario.state > 1) return
  } else {
    return
  }
  const anim1 = MARIO_ANIMATIONS[mario.state + 1].idle
  const anim2 = MARIO_ANIMATIONS[mario.state].idle

  mario.isBlocked = true
  this.anims.pauseAll()
  this.physics.pause()

  mario.setTint(0xfefefe).anims.play(anim1)
  let i = 0
  const interval = setInterval(() => {
    i++
    mario.anims.play(i % 2 === 0
      ? anim1
      : anim2
    )
    if (i > 5) {
      clearInterval(interval)
      mario.clearTint()
    }
  }, 100)

  setTimeout(() => {
    this.physics.resume()
    this.anims.resumeAll()
    mario.isBlocked = false
    mario.state++
    updateTimer.call(this)
  }, 1000)
}

function update (delta) {
  const { cameras, physics } = this
  let { levelStarted, reachedLevelEnd, furthestPlayerPos } = this
  const mario = this.mario.sprite

  this.mario.update(delta)

  const playerVelocityX = mario.body.velocity.x
  const camera = cameras.main

  if (playerVelocityX > 0 && levelStarted && !reachedLevelEnd && !camera.isFollowing &&
    mario.x >= screenWidth * 1.5 && mario.x >= (camera.worldView.x + camera.width / 2)) {
    camera.startFollow(mario, true, 0.1, 0.05)
    camera.isFollowing = true
  }

  if (playerVelocityX < 0 && furthestPlayerPos < mario.x && levelStarted && !reachedLevelEnd && camera.isFollowing) {
    furthestPlayerPos = mario.x
    physics.world.setBounds(camera.worldView.x, 0, worldWidth, screenHeight)
    camera.setBounds(camera.worldView.x, 0, worldWidth, screenHeight)
    camera.stopFollow()
    camera.isFollowing = false
  }
}

export function killMario () {
  const mario = this.mario.sprite

  if (mario.isDead) return // Si Mario ya está muerto, no hacer nada.

  mario.isDead = true
  mario.anims.play('mario-dead', true)
  mario.body.enable = false
  this.finalFlagMast.body.enable = false
  mario.setCollideWorldBounds(false) // Permitir que Mario salga de los límites del mundo del juego.

  const goombas = this.goombasGroup.getChildren()
  goombas.forEach(item => {
    item.anims.stop()
    item.body.enable = false
  })

  mario.body.checkCollision.none = true // Desactivar la colisión de Mario con el mundo.
  mario.body.setSize(16, 16).setOffset(0)
  mario.setVelocityX(0)
  setTimeout(() => {
    mario.body.enable = true
    mario.setVelocityY(-velocityY * 1.1)
  }, 500)

  this.musicTheme.stop()
  this.undergroundMusicTheme.stop()
  this.hurryMusicTheme.stop()
  this.gameOverSong.play()

  setTimeout(() => {
    // scene.restart() // Reiniciar la escena después de un tiempo.
    mario.depth = 0
    // gameOverScreen.call(this, timeLeft <= 0)
    this.physics.pause()
  }, 3000)
}
