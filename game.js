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

  this.physics.add.collider(this.mario, this.floor) // Agregar colisión entre Mario y el suelo.

  this.anims.create({
    key: 'mario-walk',
    frames: this.anims.generateFrameNumbers(
      'mario',
      { start: 1, end: 3 } // Generar fotogramas de la animación desde el sprite Mario.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1 // Repetir la animación indefinidamente.
  })

  this.anims.create({
    key: 'mario-idle',
    frames: [{ key: 'mario', frame: 0 }]
  })

  this.anims.create({
    key: 'mario-jump',
    frames: [{ key: 'mario', frame: 5 }]
  })

  this.keys = this.input.keyboard.createCursorKeys() // Crear las teclas de dirección para el control del juego.
}

function update() {
  if (this.keys.left.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x -= 2
    this.mario.flipX = true // Voltear el sprite de Mario horizontalmente.
  } else if (this.keys.right.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x += 2
    this.mario.flipX = false // Restaurar la orientación original del sprite de Mario.
  } else {
    // this.mario.anims.stop()
    // this.mario.setFrame(0) // Detener la animación y establecer el primer fotograma.
    this.mario.anims.play('mario-idle', true) // Reproducir la animación de inactividad.
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300) // Aplicar una velocidad negativa en el eje Y para simular un salto.
    this.mario.anims.play('mario-jump', true) // Reproducir la animación de salto.
  }
}