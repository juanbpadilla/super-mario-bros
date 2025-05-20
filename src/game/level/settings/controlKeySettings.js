/* global Phaser */

import { controlKeys, defaultKeys } from '../../../config/index.js'
import { specialCharMap } from '../../../utils/controls.js'

const { localStorage, alert } = window

export default class ControlKeySettings {
  constructor (scene, screenWidth, screenHeight, settingsMenuObjects, textStyle) {
    this.scene = scene
    this.screenWidth = screenWidth
    this.screenHeight = screenHeight
    this.settingsMenuObjects = settingsMenuObjects
    this.controlKeys = controlKeys
    this.specialCharMap = specialCharMap
    this.defaultKeys = defaultKeys
    this.textStyle = textStyle

    this.controlsConfig = [
      {
        control: 'JUMP',
        textPos: [1.37, 2.25],
        iconPos: [1.37, 2],
        sprite: 'mario',
        scale: screenHeight / 500,
        origin: [0.5, 0.5],
        anim: 'mario-jump',
      },
      {
        control: 'DOWN',
        textPos: [1.37, 1.75],
        iconPos: [1.37, 1.68],
        sprite: 'mario-grown',
        scale: screenHeight / 550,
        origin: [0.6, 0],
        anim: 'mario-grown-crouch',
      },
      {
        control: 'LEFT',
        textPos: [1.5, 1.75],
        iconPos: [1.56, 1.75],
        sprite: 'mario',
        scale: screenHeight / 500,
        origin: [0.6, 0.5],
        flipX: true,
      },
      {
        control: 'RIGHT',
        textPos: [1.26, 1.75],
        iconPos: [1.22, 1.75],
        sprite: 'mario',
        scale: screenHeight / 500,
        origin: [0.6, 0.5],
      },
      {
        control: 'FIRE',
        textPos: [1.65, 2.5],
        iconPos: [1.65, 2.25],
        sprite: 'fireball',
        scale: screenHeight / 300,
        origin: [0.5, 0.5],
        anim: 'fireball-right-down',
      },
    ]
  }

  displayChar (keyCode) {
    return this.specialCharMap[keyCode] || String.fromCharCode(keyCode)
  }

  create () {
    console.log(this.defaultKeys)
    this.controlsConfig.forEach(cfg => {
      const keyCode = this.controlKeys[cfg.control].keyCode

      const text = this.scene.add.text(
        this.screenWidth / cfg.textPos[0],
        this.screenHeight / cfg.textPos[1],
        this.displayChar(keyCode),
        this.textStyle
      ).setInteractive().setOrigin(0.5, 0.4).setDepth(5)
      text.name = cfg.control

      const icon = this.scene.add.sprite(
        this.screenWidth / cfg.iconPos[0],
        this.screenHeight / cfg.iconPos[1],
        cfg.sprite
      )
        .setScale(cfg.scale)
        .setOrigin(...cfg.origin)
        .setDepth(5)

      if (cfg.anim) icon.anims.play(cfg.anim, true)
      if (cfg.flipX) icon.setFlipX(true)

      this.settingsMenuObjects.add(text)
      this.settingsMenuObjects.add(icon)

      text.on('pointerdown', () => this.rebindKey(cfg.control, text))
    })
  }

  rebindKey (control, text) {
    text.setText('...')

    const keydownHandler = event => {
      document.removeEventListener('keydown', keydownHandler)

      const newKey = event.keyCode

      if (Object.values(this.controlKeys).some(k => k.keyCode === newKey)) {
        alert('Key is already in use!')
        text.setText(this.displayChar(this.controlKeys[control].keyCode))
        return
      }

      this.controlKeys[control] = this.scene.input.keyboard.addKey(newKey)
      text.setText(this.displayChar(newKey))
      localStorage.setItem(control, newKey)
    }

    document.addEventListener('keydown', keydownHandler)
  }

  restore () {
    Object.keys(this.defaultKeys).forEach(control => {
      const defaultKeyCode = this.defaultKeys[control].keyCode
      this.controlKeys[control] = this.scene.input.keyboard.addKey(defaultKeyCode)
      localStorage.setItem(control, defaultKeyCode)
    })
    // Refrescar los textos del menú
    this.settingsMenuObjects.getChildren().forEach(obj => {
      if (obj instanceof Phaser.GameObjects.Text) {
        const control = this.controlsConfig.find(cfg =>
          cfg.control === obj.name
        //   Math.abs(obj.x - this.scene.add.text(this.screenWidth / cfg.textPos[0], 0, '').x) < 5 &&
        // Math.abs(obj.y - this.scene.add.text(0, this.screenHeight / cfg.textPos[1], '').y) < 5
        )?.control

        if (control) {
          const newKeyCode = this.controlKeys[control].keyCode
          obj.setText(this.displayChar(newKeyCode))
        }
      }
    })
  }
}
