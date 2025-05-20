/* global Phaser */
import { controlKeys, defaultKeys } from '../config/index.js'

const { localStorage } = window
const keyNames = ['JUMP', 'DOWN', 'LEFT', 'RIGHT', 'FIRE', 'PAUSE']
const keys = ['SPACE', 'S', 'A', 'D', 'Q', 'ESC']
const defaultCodes = keys.map(key => Phaser.Input.Keyboard.KeyCodes[key])
// const defaultCodes = [Phaser.Input.Keyboard.KeyCodes.SPACE, Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.D, Phaser.Input.Keyboard.KeyCodes.Q, Phaser.Input.Keyboard.KeyCodes.ESC]

export function createControls () {
  // console.log(defaultCodes)
  keyNames.forEach((keyName, i) => {
    const keyCode = localStorage.getItem(keyName) ? Number(localStorage.getItem(keyName)) : defaultCodes[i]
    controlKeys[keyName] = this.input.keyboard.addKey(keyCode)
    defaultKeys[keyName] = this.input.keyboard.addKey(defaultCodes[i])
  })
}

export const specialCharMap = {
  8: 'BACKSPACE',
  9: 'TAB',
  13: 'ENTER',
  16: 'SHIFT',
  17: 'CTRL',
  18: 'ALT',
  20: 'CAPS',
  27: 'ESCAPE',
  32: 'SPACE',
  33: 'PAGE UP',
  34: 'PAGE DOWN',
  35: 'END',
  36: 'HOME',
  37: '←',
  38: '↑',
  39: '→',
  40: '↓',
  45: 'INSERT',
  46: 'DELETE',
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12',
  192: 'Ñ',
  219: '?',
  220: '¿'
}
