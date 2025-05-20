import { getTextStyle, screenHeight, screenWidth, worldWidth } from '../../../config/index.js'
import { MARIO_ANIMATIONS } from '../../../player/mario_animations.js'
import ControlKeySettings from './controlKeySettings.js'

const { localStorage } = window

export default class SettingsMenu {
  constructor (scene, config) {
    this.scene = scene
    this.musicTheme = config.musicTheme
    this.pauseSound = config.pauseSound
    this.controlKeys = config.controlKeys
    this.onClose = config.onClose || (() => {})
    this.settingsMenuCreated = false
    this.settingsMenuOpen = false
  }

  applySettings () {
    this.scene.sound.volume = this.defaultVolume()
    // this.scene.sound.volume = localStorage.getItem('volume') ? localStorage.getItem('volume') / 100 : 0.69

    if (localStorage.getItem('music-enabled')) {
      const isMuted = localStorage.getItem('music-enabled') === 'false'

      const musicElems = this.scene.musicGroup.getChildren()
      for (let i = 0; i < musicElems.length; i++) {
        musicElems[i].setMute(isMuted)
      }
    }

    if (localStorage.getItem('effects-enabled')) {
      const isMuted = localStorage.getItem('effects-enabled') === 'false'

      const effectsElems = this.scene.effectsGroup.getChildren()
      for (let i = 0; i < effectsElems.length; i++) {
        effectsElems[i].setMute(isMuted)
      }
    }
  }

  defaultVolume () {
    return parseFloat(localStorage.getItem('volume') || '69') / 100
  }

  show () {
    if (this.settingsMenuCreated) return

    const scene = this.scene
    const player = scene.mario.sprite

    this.settingsMenuCreated = true
    this.settingsMenuOpen = true

    player.anims.play(MARIO_ANIMATIONS[player.state].idle, true)
    player.isBlocked = true
    player.setVelocityX(0)
    this.musicTheme.pause()
    this.pauseSound.play()

    const textStyle = (fSize = screenWidth / 55) => getTextStyle({ fontSize: fSize, align: 'center' })

    const group = scene.add.group()
    this.settingsMenuObjects = group

    const bg = scene.add.rectangle(0, screenHeight / 2, worldWidth, screenHeight, 0x171717, 0.95).setScrollFactor(0)
    // .setOrigin(0)
    bg.depth = 4
    group.add(bg)

    const closeButton = scene.add.text(screenWidth * 0.94, screenHeight * 0.1, 'x', textStyle(screenWidth / 50))
      .setInteractive()
      .on('pointerdown', () => this.hide())
    closeButton.depth = 5
    group.add(closeButton)

    const settingsText = scene.add.text(screenWidth / 6, screenHeight * 0.15, 'Settings', textStyle(screenWidth / 45))
    settingsText.depth = 5
    group.add(settingsText)

    // Checkbox: Effects
    const effectsCheckbox = scene.add.rexCheckbox(screenWidth / 10, screenHeight / 2.3, screenWidth / 40, screenWidth / 40, {
      color: 0x323232,
      checked: localStorage.getItem('effects-enabled') !== null ? localStorage.getItem('effects-enabled') === 'true' : true,
      animationDuration: 150
    })
    effectsCheckbox.depth = 5
    group.add(effectsCheckbox)

    effectsCheckbox.on('valuechange', () => {
      localStorage.setItem('effects-enabled', effectsCheckbox.checked)
    })

    const effectsText = scene.add.text(screenWidth / 8, screenHeight / 2.3, 'Effects', textStyle())
      .setInteractive().on('pointerdown', () => effectsCheckbox.toggleChecked())
    effectsText.setOrigin(0, 0.4).depth = 5
    group.add(effectsText)

    // TODO: Falta effectsCheckbox y effectsText
    // Checkbox: Music
    const musicCheckbox = scene.add.rexCheckbox(screenWidth / 10, screenHeight / 2.9, screenWidth / 40, screenWidth / 40, {
      color: 0x323232,
      checked: localStorage.getItem('music-enabled') !== null ? localStorage.getItem('music-enabled') === 'true' : true,
      animationDuration: 150
    })
    musicCheckbox.depth = 5
    group.add(musicCheckbox)

    musicCheckbox.on('valuechange', () => {
      localStorage.setItem('music-enabled', musicCheckbox.checked)
    })

    const musicText = scene.add.text(screenWidth / 8, screenHeight / 2.9, 'Music', textStyle()).setInteractive().on('pointerdown', () => musicCheckbox.toggleChecked())
    musicText.setOrigin(0, 0.4).depth = 5
    group.add(musicText)

    // Slider: Volume
    const sliderDot = scene.add.circle(screenWidth / 5.15, screenHeight / 1.6, screenWidth / 115, 0xffffff, 0.75).setInteractive({ useHandCursor: true })
    // const defaultVolume = localStorage.getItem('volume') ? parseFloat(localStorage.getItem('volume')) / 100 : 0.69
    const defaultVolume = this.defaultVolume()
    sliderDot.slider = scene.plugins.get('rexsliderplugin').add(sliderDot, {
      endPoints: [
        { x: sliderDot.x - screenWidth / 9.5, y: sliderDot.y },
        { x: sliderDot.x + screenWidth / 9.5, y: sliderDot.y }
      ],
      value: defaultVolume
    })
    sliderDot.depth = 5
    group.add(sliderDot)

    const sliderBar = scene.add.graphics()
    sliderBar.lineStyle(5, 0x373737, 1).strokePoints(sliderDot.slider.endPoints)
    sliderBar.depth = 4
    group.add(sliderBar)

    const sliderText = scene.add.text(screenWidth / 5.15, screenHeight / 1.85, 'General volume', textStyle(screenWidth / 60)).setOrigin(0.5, 0)
    sliderText.depth = 5
    group.add(sliderText)

    const volumeText = scene.add.text(screenWidth / 5.15, screenHeight / 1.5, Math.trunc(defaultVolume * 100), textStyle(screenWidth / 80)).setOrigin(0.5, 0)
    volumeText.depth = 5
    group.add(volumeText)

    sliderDot.slider.on('valuechange', () => {
      const value = Math.trunc(sliderDot.slider.value * 100)
      volumeText.setText(value)
      localStorage.setItem('volume', value)
    })

    // TODO: falta localStorage.getItem('volume')

    // Línea de separación
    const line = scene.add.graphics()
    line.lineStyle(0.5, 0xffffff, 0.1).strokePoints([
      { x: screenWidth / 2, y: screenHeight * 0.15 },
      { x: screenWidth / 2, y: screenHeight * 0.85 }
    ])
    line.depth = 4
    group.add(line)

    // Controles
    const controlsText = scene.add.text(screenWidth / 1.5, screenHeight * 0.15, 'Controls', textStyle(screenWidth / 45))
    controlsText.depth = 5
    group.add(controlsText)

    const keySettings = new ControlKeySettings(scene, screenWidth, screenHeight, this.settingsMenuObjects, textStyle())
    keySettings.create()

    const restoreText = scene.add.text(screenWidth * 0.8, screenHeight * 0.85, 'Restore', textStyle(screenWidth / 60))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => keySettings.restore())
    restoreText.on('pointerover', () => {
      restoreText.setColor('#8d8d8d')
    }).on('pointerout', () => {
      restoreText.setColor('#fff')
    })
    restoreText.depth = 5
    group.add(restoreText)
    console.log(restoreText)
  }

  hide () {
    const player = this.scene.mario.sprite
    // const settingsObjects = this.settingsMenuObjects.getChildren()

    // for (let i = 0; i < settingsObjects.length; i++) {
    //   settingsObjects[i].visible = false
    // }
    if (!this.settingsMenuOpen) return
    this.settingsMenuObjects?.clear(true, true)
    this.applySettings()
    this.settingsMenuOpen = false
    this.settingsMenuCreated = false
    player.isBlocked = false
    this.musicTheme?.resume()
    this.onClose()
  }
}
