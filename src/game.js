/* global Phaser */

import { createAnimations } from './animations.js' // Importar la función createAnimations desde el archivo animations.js.
import { initAudio, initSounds } from './audio.js'
import PlayerController from './game/player/playerController.js'
import { drawStartScreen } from './game/ui/drawStartScreen.js'
import { levelGravity, platformHeight, playerOptions, screenHeight, screenWidth, startOffset, velocityX, velocityY, worldWidth } from './game/services/config.js'
import { generateLevel } from './game/ui/generateLevel.js'
import { initImages, initSpriteSheet } from './spritesheet.js'
import { createControls } from './game/services/controls.js'
import { drawWorld } from './game/ui/drawWorld.js'
import { createEnemies } from './game/ui/enemies-control.js'

const loadingGif = document.querySelectorAll('.loading-gif')

const config = {
  autofocus: false,
  type: Phaser.AUTO, // Tipo de renderizado (WebGL o Canvas) especificado automáticamente por Phaser.
  width: screenWidth,
  height: screenHeight,
  backgroundColor: 0x049cd8,
  parent: 'game', // ID del elemento HTML donde se renderizará el juego.
  preserveDrawingBuffer: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: levelGravity },
      debug: true,
    },
  },
  scene: {
    preload, // Método para cargar recursos antes de iniciar el juego.
    create, // Método para crear los elementos del juego. (se ejecuta una vez al inicio).
    update, // Método que se ejecuta en cada frame del juego.
  },
}

// eslint-disable-next-line no-new
new Phaser.Game(config) // Crear una nueva instancia del juego con la configuración especificada.
//  this -> game -> el juego que estamos construyendo

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
  // let { isLevelOverworld, levelStyle } = playerOptions
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
    style: {
      font: screenWidth / 96 + 'px pixel',
      fill: '#ffffff'
    }
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

  // isLevelOverworld = Phaser.Math.Between(0, 100) <= 84
  playerOptions.setLevel(Phaser.Math.Between(0, 100) <= 84)
  // levelStyle = isLevelOverworld ? 'overworld' : 'underground'
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

  this.pauseOverlay = this.add.rectangle(0, 0, config.width, config.height, 0x000000, 0.5)
  this.pauseOverlay.setOrigin(0, 0)
  this.pauseOverlay.setVisible(this.isPaused)
    .depth = 4

  this.pauseMenu = this.add.text(config.width / 2, config.height / 2, 'PAUSED', {
    fontFamily: 'pixel',
    fontSize: config.width / 20,
    align: 'center',
  }).setOrigin(0.5, 0.5).setVisible(this.isPaused) // Crear el menú de pausa y ocultarlo inicialmente.
  this.pauseMenu.depth = 5
  console.log(playerOptions.levelStyle)

  this.smoothedControls = new SmoothedHorionztalControl(0.001)
}

// function collectItem (mario, item) {
//   const { texture: { key } } = item
//   item.destroy()

//   if (key === 'coin') {
//     this.coinSound.play()
//     addToScore(100, item, this)
//   } else if (key === 'supermushroom') {
//     this.consumePowerUpSound.play()
//     mario.isBlocked = true
//     this.anims.pauseAll()
//     // this.physics.world.pause()
//     this.physics.pause()

//     mario.setTint(0xfefefe).anims.play('mario-grown-idle')
//     let i = 0
//     const interval = setInterval(() => {
//       i++
//       mario.anims.play(i % 2 === 0
//         ? 'mario-grown-idle'
//         : 'mario-idle'
//       )
//       if (i > 5) {
//         clearInterval(interval)
//         mario.clearTint()
//       }
//     }, 100)

//     // mario.isGrown = true

//     setTimeout(() => {
//       // mario.setDisplaySize(18, 32)
//       // mario.body.setSize(18, 32)
//       // this.physics.world.resume()
//       this.physics.resume()
//       this.anims.resumeAll()
//       mario.isBlocked = false
//       mario.state = 1
//       // clearInterval(interval)
//     }, 1000)
//     // console.log(mario)
//   }
// }

export function addToScore (scoreAdd, origin) {
  if (!origin) return

  const scoreText = this.add.text(
    origin.getBounds().x,
    origin.getBounds().y,
    scoreAdd,
    {
      fontFamily: 'pixel',
      fontSize: (screenWidth / 150),
      align: 'center'
    }
  )

  scoreText.setOrigin(0).smoothed = true
  scoreText.depth = 5

  this.tweens.add({
    targets: scoreText,
    duration: 600,
    y: scoreText.y - screenHeight / 6.5,
    onComplete: () => {
      this.tweens.add({
        targets: scoreText,
        duration: 100,
        alpha: 0,
        onComplete: () => {
          scoreText.destroy() // Destruir el texto de puntuación después de que se complete la animación.
        }
      })
    }
  })
}

function update (delta) {
  const { cameras, physics } = this
  let { levelStarted, reachedLevelEnd, furthestPlayerPos } = this
  const mario = this.mario.sprite
  this.mario.update(delta)

  // checkControls.call(this, delta)
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
