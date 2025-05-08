/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* global Phaser */

import { createAnimations } from './animations.js' // Importar la función createAnimations desde el archivo animations.js.
import { initAudio, playAudio } from './audio.js'
import { checkControls } from './controls.js'
import { drawStartScreen } from './game/drawStartScreen.js'
import { isLevelOverworld, levelGravity, platformHeight, platformPieces, platformPiecesWidth, playerOptions, screenHeight, screenWidth, startOffset, velocityX, worldHolesCoords, worldWidth } from './game/services/config.js'
import { destroyBlock, revealHiddenBlock } from './game/ui/blocks.js'
import { generateStructure } from './game/ui/structures.js'
import { initImages, initSpriteSheet } from './spritesheet.js'

const loadingGif = document.querySelectorAll('.loading-gif')

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
      debug: true,
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

let SmoothedHorionztalControl = new Phaser.Class({

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

  this.gameWinned = false
  this.gameOver = false

  this.physics.world.setBounds(0, 0, worldWidth, screenHeight) // Establecer los límites del mundo del juego.

  this.cameras.main.setBounds(0, 0, worldWidth, screenHeight) // Establecer los límites de la cámara.
  this.cameras.main.isFollowing = false

  createAnimations(this) // Crear las animaciones de Mario.

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
  // console.log(this.mario)

  generateLevel.call(this)
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

  this.smoothedControls = new SmoothedHorionztalControl(0.001)
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

function update (delta) {
  const { mario } = this // Desestructurar el objeto this para obtener la referencia a Mario.
  // const cam = this.cameras.main

  checkControls(this, delta)

  // const playerVelocityX = mario.body.velocity.x
  // const camera = this.cameras.main
  // Pausar el juego si se presiona la tecla Escape.
  // if (this.isPaused) {
  //   this.pauseOverlay.setPosition(cam.scrollX, cam.scrollY)
  //   this.pauseMenu.setPosition(cam.scrollX + (cam.width / 2), this.pauseMenu.y)
  //   this.physics.world.pause()
  //   this.anims.pauseAll()
  // } else {
  //   this.physics.world.resume()
  //   this.anims.resumeAll()
  // }

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

function generateLevel () {
  // > Creating the platform
  const player = this.mario

  // pieceStart will be the next platform piece start pos. This value will be modified after each execution
  let pieceStart = screenWidth
  // This will tell us if last generated piece of platform was empty, to avoid generating another empty piece next to it.
  let lastWasHole = 0
  // Structures will generate every 2/3 platform pieces
  let lastWasStructure = 0

  this.platformGroup = this.add.group()
  this.fallProtectionGroup = this.add.group()
  this.blocksGroup = this.add.group()
  this.constructionBlocksGroup = this.add.group()
  this.misteryBlocksGroup = this.add.group()
  this.immovableBlocksGroup = this.add.group()
  this.groundCoinsGroup = this.add.group()

  if (!isLevelOverworld) {
    // this.blocksGroup.add(this.add.tileSprite(worldWidth - screenWidth, screenHeight - (platformHeight * 4.5), screenWidth * 2.9, 16, 'block').setScale(screenHeight / 345).setOrigin(1, 0));
    this.blocksGroup.add(this.add.tileSprite(screenWidth, screenHeight - platformHeight / 1.2, 16, screenHeight - platformHeight, 'block2').setScale(screenHeight / 345).setOrigin(0, 1))
    this.undergroundRoof = this.add.tileSprite(screenWidth * 1.2, screenHeight / 13, worldWidth / 2.68, 16, 'block2').setScale(screenHeight / 345).setOrigin(0)
    this.blocksGroup.add(this.undergroundRoof)
  }

  for (let i = 0; i <= platformPieces; i++) {
    // Holes will have a 10% chance of spawning
    const number = Phaser.Math.Between(0, 100)

    // Check if its not a hole, this means is not that 20%, is not in the spawn safe area and is not close to the end castle.
    if (pieceStart >= (lastWasHole > 0 || lastWasStructure > 0 || worldWidth - platformPiecesWidth * 4) || number <= 0 || pieceStart <= screenWidth * 2 || pieceStart >= worldWidth - screenWidth * 2) {
      lastWasHole--

      // > Create platform
      const Npiece = this.add.tileSprite(pieceStart, screenHeight, platformPiecesWidth, platformHeight, 'floorbricks').setScale(2).setOrigin(0, 0.5)
      this.physics.add.existing(Npiece)
      Npiece.body.immovable = true
      Npiece.body.allowGravity = false
      Npiece.isPlatform = true
      Npiece.depth = 2
      this.platformGroup.add(Npiece)
      // Apply player collision with platform
      this.physics.add.collider(player, Npiece)

      // > Creating world structures

      if (!(pieceStart >= (worldWidth - screenWidth * (isLevelOverworld ? 1 : 1.5))) && pieceStart > (screenWidth + platformPiecesWidth * 2) && lastWasHole < 1 && lastWasStructure < 1) {
        lastWasStructure = generateStructure.call(this, pieceStart)
      } else {
        lastWasStructure--
      }
    } else {
      // Save every hole start and end for later use
      worldHolesCoords.push({
        start: pieceStart,
        end: pieceStart + platformPiecesWidth * 2
      })

      lastWasHole = 2
      this.fallProtectionGroup.add(this.add.rectangle(pieceStart + platformPiecesWidth * 2, screenHeight - platformHeight, 5, 5).setOrigin(0, 1))
      this.fallProtectionGroup.add(this.add.rectangle(pieceStart, screenHeight - platformHeight, 5, 5).setOrigin(1, 1))
    }
    pieceStart += platformPiecesWidth * 2
  }

  this.startScreenTrigger = this.add.tileSprite(screenWidth, screenHeight - platformHeight, 32, 28, 'horizontal-tube').setScale(screenHeight / 345).setOrigin(1, 1)
  this.startScreenTrigger.depth = 4
  this.physics.add.existing(this.startScreenTrigger)
  this.startScreenTrigger.body.allowGravity = false
  this.startScreenTrigger.body.immovable = true
  this.physics.add.collider(player, this.startScreenTrigger, startLevel, null, this)

  const invisibleWall2 = this.add.rectangle(screenWidth, screenHeight - platformHeight, 1, screenHeight).setOrigin(0.5, 1)

  // let invisibleWall2 = this.add.rectangle(screenWidth - 10, screenHeight - platformHeight, 10, screenHeight, 0x000000, 0.9).setOrigin(0.5, 1)

  this.physics.add.existing(invisibleWall2)
  invisibleWall2.body.allowGravity = false
  invisibleWall2.body.immovable = true
  this.physics.add.collider(this.mario, invisibleWall2)
  this.fallProtectionGroup.add(invisibleWall2)
  console.log(invisibleWall2)

  if (!isLevelOverworld) {
    this.verticalTube = this.add.tileSprite(worldWidth - screenWidth, screenHeight - platformHeight, 32, screenHeight, 'vertical-extralarge-tube').setScale(screenHeight / 345).setOrigin(1, 1)
    this.verticalTube.depth = 2
    this.physics.add.existing(this.verticalTube)
    this.verticalTube.body.allowGravity = false
    this.verticalTube.body.immovable = true
    this.physics.add.collider(player, this.verticalTube)

    this.finalTrigger = this.add.tileSprite(worldWidth - screenWidth * 1.03, screenHeight - platformHeight, 40, 31, 'horizontal-final-tube').setScale(screenHeight / 345).setOrigin(1, 1)
    this.finalTrigger.depth = 2
    this.physics.add.existing(this.finalTrigger)
    this.finalTrigger.body.allowGravity = false
    this.finalTrigger.body.immovable = true
    this.physics.add.collider(player, this.finalTrigger, teleportToLevelEnd, null, this)

    const invisibleWall1 = this.add.rectangle(worldWidth - screenWidth, screenHeight - platformHeight, 1, screenHeight).setOrigin(0.5, 1)
    this.physics.add.existing(invisibleWall1)
    invisibleWall1.body.allowGravity = false
    invisibleWall1.body.immovable = true
    this.physics.add.collider(player, invisibleWall1)
    this.fallProtectionGroup.add(invisibleWall1)
  }

  let fallProtections = this.fallProtectionGroup.getChildren()
  for (let i = 0; i < fallProtections.length; i++) {
    this.physics.add.existing(fallProtections[i])
    fallProtections[i].body.allowGravity = false
    fallProtections[i].body.immovable = true
  }

  // Stablish properties for every generated structure
  let misteryBlocks = this.misteryBlocksGroup.getChildren()
  for (let i = 0; i < misteryBlocks.length; i++) {
    this.physics.add.existing(misteryBlocks[i])
    misteryBlocks[i].body.allowGravity = false
    misteryBlocks[i].body.immovable = true
    misteryBlocks[i].depth = 2
    misteryBlocks[i].anims.play('mistery-block-default', true)
    this.physics.add.collider(player, misteryBlocks[i], revealHiddenBlock, null, this)
  }

  // Apply player collision with blocks
  let blocks = this.blocksGroup.getChildren()
  for (let i = 0; i < blocks.length; i++) {
    this.physics.add.existing(blocks[i])
    blocks[i].body.allowGravity = false
    blocks[i].body.immovable = true
    blocks[i].depth = 2
    this.physics.add.collider(player, blocks[i], destroyBlock, null, this)
  }

  // Apply player collision with immovable blocks
  let constructionBlocks = this.constructionBlocksGroup.getChildren()
  for (let i = 0; i < constructionBlocks.length; i++) {
    this.physics.add.existing(constructionBlocks[i])
    constructionBlocks[i].isImmovable = true
    constructionBlocks[i].body.allowGravity = false
    constructionBlocks[i].body.immovable = true
    constructionBlocks[i].depth = 2
    this.physics.add.collider(player, constructionBlocks[i], destroyBlock, null, this)
  }

  // Apply player collision with immovable blocks
  let immovableBlocks = this.immovableBlocksGroup.getChildren()
  for (let i = 0; i < immovableBlocks.length; i++) {
    this.physics.add.existing(immovableBlocks[i])
    immovableBlocks[i].body.allowGravity = false
    immovableBlocks[i].body.immovable = true
    immovableBlocks[i].depth = 2
    this.physics.add.collider(player, immovableBlocks[i])
  }

  let groundCoins = this.groundCoinsGroup.getChildren()
  for (let i = 0; i < groundCoins.length; i++) {
    this.physics.add.existing(groundCoins[i])
    groundCoins[i].anims.play('ground-coin-default', true)
    groundCoins[i].body.allowGravity = false
    groundCoins[i].body.immovable = true
    groundCoins[i].depth = 2
    this.physics.add.overlap(player, groundCoins[i], collectCoin, null, this)
  }
}

function startLevel (player, trigger) {
  // const player = this.mario
  // console.log(player)
  if (!player.body.blocked.right && !trigger.body.blocked.left) { return }
  console.log('start level')

  this.physics.world.setBounds(screenWidth, 0, worldWidth, screenHeight)
}

// function revealHiddenBlock () { console.log('revealHiddenBlock') }
// function destroyBlock () { console.log('destroyBlock') }
function collectCoin () { console.log('collectCoin') }
function teleportToLevelEnd () { console.log('teleportToLevelEnd') }
