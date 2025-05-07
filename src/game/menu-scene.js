// src/scenes/MainScene.js
// import { initImages, initSpriteSheet, initAudio } from '../loaders/initAssets.js'
import { createAnimations } from '../loaders/animations.js'
import { collectItem, onHitEnemy, checkControls, killMario } from '../game/logic.js'

// eslint-disable-next-line no-undef
export default class MainScene extends Phaser.Scene {
  constructor () {
    super('MainScene')
  }

  create () {
    createAnimations(this)

    this.physics.world.setBounds(0, 0, worldWidth, screenHeight)
    this.cameras.main.setBounds(0, 0, worldWidth, screenHeight)

    this.mario = this.physics.add
      .sprite(startOffset, screenHeight - platformHeight, 'mario')
      .setOrigin(1)
      .setBounce(0)
      .setCollideWorldBounds(true)
      .setScale(screenHeight / 376)
    this.mario.depth = 3

    drawStartScreen.call(this)

    this.enemy = this.physics.add
      .sprite(120, this.game.config.height - 30, 'goomba')
      .setOrigin(0, 1)
      .setGravityY(300)
      .setVelocityX(-50)

    this.collectibes = this.physics.add.staticGroup()
    this.collectibes.create(150, 150, 'coin').anims.play('coin-idle', true)
    this.collectibes.create(300, 150, 'coin').anims.play('coin-idle', true)
    this.collectibes.create(200, this.game.config.height - 40, 'supermushroom').anims.play('supermushroom-idle', true)

    this.physics.add.overlap(this.mario, this.collectibes, collectItem, null, this)
    this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this)

    this.cameras.main.startFollow(this.mario)

    this.keys = this.input.keyboard.createCursorKeys()
    this.keys.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

    this.isPaused = false

    this.pauseOverlay = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000, 0.0)
      .setOrigin(0, 0)
      .setVisible(this.isPaused)

    this.pauseMenu = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'PAUSED', {
      fontFamily: 'pixel',
      fontSize: this.game.config.width / 20,
      align: 'center',
    }).setOrigin(0.5, 0.5).setVisible(this.isPaused)
  }

  update () {
    const { mario } = this
    const cam = this.cameras.main

    checkControls(this, velocityY)

    if (this.isPaused) {
      this.pauseOverlay.setPosition(cam.scrollX, cam.scrollY)
      this.pauseMenu.setPosition(cam.scrollX + cam.width / 2, this.pauseMenu.y)
      this.physics.world.pause()
      this.anims.pauseAll()
    } else {
      this.physics.world.resume()
      this.anims.resumeAll()
    }

    if (mario.y >= this.game.config.height) {
      killMario(this)
    }
  }
}
