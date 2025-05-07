import { initAudio } from '../audio.js'
import { initImages, initSpriteSheet } from '../spritesheet.js'

// eslint-disable-next-line no-undef
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('BootScene')
  }

  preload () {
    // Load Fonts
    this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml')

    initImages(this)

    initSpriteSheet(this)

    // --- audio ---
    initAudio(this)

    // Esperamos a que las fuentes estén cargadas
    this.load.once('complete', () => {
      document.fonts.ready.then(() => {
        this.scene.start('MainScene') // o la escena a la que quieres ir después
      })
    })

    // Inicia la carga manual, aunque no tengas assets aquí
    this.load.start()
  }
}
