import { controlKeys } from './config.js'

export function createControls () {
  const keyNames = ['JUMP', 'DOWN', 'LEFT', 'RIGHT', 'FIRE', 'PAUSE']
  // eslint-disable-next-line no-undef
  const defaultCodes = [Phaser.Input.Keyboard.KeyCodes.SPACE, Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.D, Phaser.Input.Keyboard.KeyCodes.Q, Phaser.Input.Keyboard.KeyCodes.ESC]

  keyNames.forEach((keyName, i) => {
    // eslint-disable-next-line no-undef
    const keyCode = localStorage.getItem(keyName) ? Number(localStorage.getItem(keyName)) : defaultCodes[i]
    controlKeys[keyName] = this.input.keyboard.addKey(keyCode)
  })
}
