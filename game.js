/* global Phaser */

import { createAnimations } from './animations.js' // Importar la función createAnimations desde el archivo animations.js.

/**
 * Phaser es una librería de JavaScript para crear juegos en 2D.
 * Al importar el archivo Phaser.js, se puede utilizar la clase Phaser.Game para crear un nuevo juego.
 * 
 */
const config = {
  type: Phaser.AUTO, // Tipo de renderizado (WebGL o Canvas) especificado automáticamente por Phaser.
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game", // ID del elemento HTML donde se renderizará el juego.
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload, // Método para cargar recursos antes de iniciar el juego.
    create, // Método para crear los elementos del juego. (se ejecuta una vez al inicio).
    update // Método que se ejecuta en cada frame del juego.
  }
}

new Phaser.Game(config) // Crear una nueva instancia del juego con la configuración especificada.
//  this -> game -> el juego que estamos construyendo

function preload() { // 1.
  this.load.image(
    'cloud1',
    'assets/scenery/overworld/cloud1.png'
  )

  this.load.image(
    'floorbricks',
    'assets/scenery/overworld/floorbricks.png'
  )

  this.load.spritesheet(
    'mario',  // <-- id-del-asset
    'assets/entities/mario.png',
    { frameWidth: 18, frameHeight: 16 }
  )

  this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
}

function create() { // 2.
  //  image(x, y, id-del-asset)
  this.add.image(100, 50, 'cloud1')
    .setOrigin(0, 0) // Cambia el origen de la imagen a la esquina superior izquierda.
    .setScale(0.15)

  this.floor = this.physics.add.staticGroup() // Crear un grupo estático para los objetos que no se mueven.

  this.floor
    .create(0, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody() // Actualizar el cuerpo físico del objeto para que coincida con su nueva posición.
    
    this.floor
    .create(150, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody() // Actualizar el cuerpo físico del objeto para que coincida con su nueva posición.

  this.mario = this.physics.add.sprite(50, 100, 'mario')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true) // Evitar que Mario salga de los límites del mundo del juego.
    .setGravityY(300)

  this.physics.world.setBounds(0, 0, 2000, config.height) // Establecer los límites del mundo del juego.
  this.physics.add.collider(this.mario, this.floor) // Agregar colisión entre Mario y el suelo.

  this.cameras.main.setBounds(0, 0, 2000, config.height) // Establecer los límites de la cámara.
  this.cameras.main.startFollow(this.mario) // Hacer que la cámara siga a Mario.

  createAnimations(this) // Crear las animaciones de Mario.

  this.keys = this.input.keyboard.createCursorKeys() // Crear las teclas de dirección para el control del juego.
}

function update() {
  const { keys, mario } = this

  const isMarioTouchingFloor = mario.body.touching.down

  const isLeftKeyDown = keys.left.isDown
  const isRightKeyDown = keys.right.isDown
  const isUpKeyDown = keys.up.isDown

  if (mario.isDead) return

  if (isLeftKeyDown) {
    isMarioTouchingFloor && mario.anims.play('mario-walk', true)
    mario.x -= 2
    mario.flipX = true // Voltear el sprite de Mario horizontalmente.
  } else if (isRightKeyDown) {
    isMarioTouchingFloor && mario.anims.play('mario-walk', true)
    mario.x += 2
    mario.flipX = false // Restaurar la orientación original del sprite de Mario.
  } else if(isMarioTouchingFloor) {
    mario.anims.play('mario-idle', true) // Reproducir la animación de inactividad.
  }

  if (isUpKeyDown && isMarioTouchingFloor) {
    mario.setVelocityY(-300) // Aplicar una velocidad negativa en el eje Y para simular un salto.
    mario.anims.play('mario-jump', true) // Reproducir la animación de salto.
  }

  if (mario.y >= config.height) {
    mario.isDead = true
    mario.anims.play('mario-dead')
    mario.setCollideWorldBounds(false) // Permitir que Mario salga de los límites del mundo del juego.
    this.sound.add('gameover', { volume: 0.2 }).play()

    setTimeout(() => {
      mario.setVelocityY(-350)
    }, 100)

    setTimeout(() => {
      scene.restart() // Reiniciar la escena después de un tiempo.
    }, 2000)
  }
}