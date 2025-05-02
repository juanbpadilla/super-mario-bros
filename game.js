/* global Phaser */
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
}

function create() { // 2.
  //  image(x, y, id-del-asset)
  this.add.image(100, 50, 'cloud1')
    .setOrigin(0, 0) // Cambia el origen de la imagen a la esquina superior izquierda.
    .setScale(0.15)

  this.add.tileSprite(0, config.height - 32, config.width, 32, 'floorbricks')
    .setOrigin(0, 0)

  this.mario = this.add.sprite(50, 210, 'mario')
    .setOrigin(0, 1)

  this.anims.create({
    key: 'mario-walk',
    frames: this.anims.generateFrameNumbers(
      'mario',
      { start: 1, end: 3 } // Generar fotogramas de la animación desde el sprite Mario.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1 // Repetir la animación indefinidamente.
  })

  this.keys = this.input.keyboard.createCursorKeys() // Crear las teclas de dirección para el control del juego.
}

function update() {
  if (this.keys.left.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x -= 2
  } else if (this.keys.right.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x += 2
  } else {
    this.mario.anims.stop()
    this.mario.setFrame(0) // Detener la animación y establecer el primer fotograma.
  }
}