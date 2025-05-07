/* eslint-disable no-new */
/* global Phaser */

import { createAnimations } from './animations.js' // Importar la función createAnimations desde el archivo animations.js.
import { initAudio, playAudio } from './audio.js'
import { checkControls } from './controls.js'
import { drawStartScreen } from './game/drawStartScreen.js'
import { initImages, initSpriteSheet } from './spritesheet.js'

const loadingGif = document.querySelectorAll('.loading-gif')
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight * 1.1
console.log({ screenWidth }, { screenHeight })

// const velocityX = screenWidth / 4.5
const velocityY = screenHeight / 1.15

const levelGravity = velocityY * 2

const config = {
  autofocus: false,
  type: Phaser.AUTO, // Tipo de renderizado (WebGL o Canvas) especificado automáticamente por Phaser.
  // width: 256,
  width: screenWidth,
  // height: 244,
  height: screenHeight,
  backgroundColor: 0x049cd8,
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

new Phaser.Game(config) // Crear una nueva instancia del juego con la configuración especificada.
//  this -> game -> el juego que estamos construyendo

const worldWidth = screenWidth * 11
const platformHeight = screenHeight / 5

const startOffset = screenWidth / 2.5
// Hole with is calculated dividing the world width in x holes of the same size.
// const platformPieces = 100
// const platformPiecesWidth = (worldWidth - screenWidth) / platformPieces

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

  initImages(this)

  initSpriteSheet(this)

  // --- audio ---
  initAudio(this)
}

function create () {
  this.screenWidth = screenWidth
  this.screenHeight = screenHeight
  this.platformHeight = platformHeight
  createAnimations(this) // Crear las animaciones de Mario.

  this.physics.world.setBounds(0, 0, worldWidth, screenHeight) // Establecer los límites del mundo del juego.
  this.cameras.main.setBounds(0, 0, worldWidth, screenHeight) // Establecer los límites de la cámara.
  this.cameras.main.isFollowing = false

  // this.add
  //   .image(100, 50, 'cloud1')
  //   .setOrigin(0, 0) // Cambia el origen de la imagen a la esquina superior izquierda.
  //   .setScale(0.15)

  // this.floor = this.physics.add.staticGroup() // Crear un grupo estático para los objetos que no se mueven.

  // this.floor
  //   .create(0, config.height - 16, 'floorbricks')
  //   .setOrigin(0, 0.5)
  //   .refreshBody() // Actualizar el cuerpo físico del objeto para que coincida con su nueva posición.

  // this.floor
  //   .create(150, config.height - 16, 'floorbricks')
  //   .setOrigin(0, 0.5)
  //   .refreshBody() // Actualizar el cuerpo físico del objeto para que coincida con su nueva posición.

  this.mario = this.physics.add
    // .sprite(50, 100, 'mario')
    .sprite(startOffset, screenHeight - platformHeight, 'mario')
    // .setOrigin(0, 1)
    .setOrigin(1)
    .setBounce(0)
    .setCollideWorldBounds(true) // Evitar que Mario salga de los límites del mundo del juego.
    .setScale(screenHeight / 376)
    // .setGravityY(300)
  this.mario.depth = 3

  drawStartScreen.call(this, config)

  this.enemy = this.physics.add
    .sprite(120, config.height - 30, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-50)

  this.collectibes = this.physics.add.staticGroup()
  this.collectibes.create(150, 150, 'coin').anims.play('coin-idle', true)
  this.collectibes.create(300, 150, 'coin').anims.play('coin-idle', true)
  this.collectibes.create(200, config.height - 40, 'supermushroom').anims.play('supermushroom-idle', true)
  this.physics.add.overlap(this.mario, this.collectibes, collectItem, null, this)

  // this.physics.add.collider(this.mario, this.floor) // Agregar colisión entre Mario y el suelo.
  // this.physics.add.collider(this.enemy, this.floor)
  this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this)

  // this.cameras.main.startFollow(this.mario) // Hacer que la cámara siga a Mario.

  // this.enemy.anims.play('goomba-walk', true)

  this.keys = this.input.keyboard.createCursorKeys() // Crear las teclas de dirección para el control del juego.
  this.keys.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC) // Crear la tecla ESC para salir del juego.

  this.isPaused = false

  this.pauseOverlay = this.add.rectangle(0, 0, config.width, config.height, 0x000000, 0.0)
  this.pauseOverlay.setOrigin(0, 0)
  this.pauseOverlay.setVisible(this.isPaused)

  this.pauseMenu = this.add.text(config.width / 2, config.height / 2, 'PAUSED', {
    fontFamily: 'pixel',
    fontSize: config.width / 20,
    align: 'center',
  }).setOrigin(0.5, 0.5).setVisible(this.isPaused) // Crear el menú de pausa y ocultarlo inicialmente.
}

function collectItem (mario, item) {
  const { texture: { key } } = item
  item.destroy()

  if (key === 'coin') {
    playAudio('coin-pickup', this, { volume: 0.1 }) // Reproducir el sonido de recoger una moneda.
    addToScore(100, item, this)
  } else if (key === 'supermushroom') {
    this.physics.world.pause()
    this.anims.pauseAll()

    playAudio('powerup', this, { volume: 0.1 })
    let i = 0
    const interval = setInterval(() => {
      i++
      mario.anims.play(i % 2 === 0
        ? 'mario-grown-idle'
        : 'mario-idle'
      )
    }, 100)

    mario.isBlocked = true
    mario.isGrown = true

    setTimeout(() => {
      mario.setDisplaySize(18, 32)
      mario.body.setSize(18, 32)
      this.anims.resumeAll()
      mario.isBlocked = false
      clearInterval(interval)
      this.physics.world.resume()
    }, 1000)
  }
}

function addToScore (scoreAdd, origin, game) {
  const scoreText = game.add.text(
    origin.x,
    origin.y,
    scoreAdd,
    {
      fontFamily: 'pixel',
      fontSize: config.width / 40
    }
  )

  game.tweens.add({
    targets: scoreText,
    duration: 500,
    y: scoreText.y - 20,
    onComplete: () => {
      game.tweens.add({
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

function onHitEnemy (mario, enemy) {
  if (mario.body.touching.down && enemy.body.touching.up) {
    enemy.anims.play('goomba-hurt', true)
    enemy.setVelocityX(0)
    mario.setVelocityY(-200)

    playAudio('goomba-stomp', this)
    addToScore(200, enemy, this)

    setTimeout(() => {
      enemy.destroy()
    }, 500)
  } else {
    killMario(this)
  }
}

function update () {
  const { mario } = this // Desestructurar el objeto this para obtener la referencia a Mario.
  const cam = this.cameras.main

  checkControls(this, velocityY)

  // Pausar el juego si se presiona la tecla Escape.
  if (this.isPaused) {
    this.pauseOverlay.setPosition(cam.scrollX, cam.scrollY)
    this.pauseMenu.setPosition(cam.scrollX + (cam.width / 2), this.pauseMenu.y)
    this.physics.world.pause()
    this.anims.pauseAll()
  } else {
    this.physics.world.resume()
    this.anims.resumeAll()
  }

  if (mario.y >= config.height) {
    killMario(this)
  }
}

function killMario (game) {
  const { mario, scene } = game

  if (mario.isDead) return // Si Mario ya está muerto, no hacer nada.

  mario.isDead = true
  mario.anims.play('mario-dead')
  mario.setCollideWorldBounds(false) // Permitir que Mario salga de los límites del mundo del juego.

  playAudio('gameover', game, { volume: 0.2 })

  mario.body.checkCollision.none = true // Desactivar la colisión de Mario con el mundo.
  mario.setVelocityX(0)

  setTimeout(() => {
    mario.setVelocityY(-250)
  }, 100)

  // this.physics.world.pause()
  // this.anims.pauseAll()

  setTimeout(() => {
    scene.restart() // Reiniciar la escena después de un tiempo.
  }, 2000)
}
