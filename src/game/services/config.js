/* global Phaser */
export const screenWidth = window.innerWidth
export const screenHeight = window.innerHeight * 1.1

export const velocityX = screenWidth / 4.5
export const velocityY = screenHeight / 1.15

export const levelGravity = velocityY * 2

export const worldWidth = screenWidth * 11
export const platformHeight = screenHeight / 5

export const startOffset = screenWidth / 2.5
// Hole with is calculated dividing the world width in x holes of the same size.
export const platformPieces = 100
export const platformPiecesWidth = (worldWidth - screenWidth) / platformPieces

export const worldHolesCoords = []

export const emptyBlocksList = []

class PlayerOptions {
  constructor (playerController, isLevelOverworld, timeLeft, score) {
    this.playerController = playerController
    this.isLevelOverworld = isLevelOverworld
    this.levelStyle = this.isLevelOverworld ? 'overworld' : 'underground'
    this.timeLeft = timeLeft
    this.score = score
  }

  setLevel (isLevelOverworld) {
    this.isLevelOverworld = isLevelOverworld
  }

  setLevelStyle () {
    this.levelStyle = this.isLevelOverworld ? 'overworld' : 'underground'
  }
}
export const playerOptions = new PlayerOptions(
  null,
  Phaser.Math.Between(0, 100) <= 84,
  300,
  0
)

const thisfontSize = screenWidth < 991 ? 13 : 21

export function getTextStyle (override = {}, useBitmapFont = false) {
  if (useBitmapFont) {
    return {
      font: override.font || 'carrier_command',
    }
  }

  const rootStyles = window.getComputedStyle(document.documentElement)

  const defaultStyle = {
    fontSize: rootStyles.getPropertyValue('--fontSize').trim() || '16px',
    fontFamily: rootStyles.getPropertyValue('--fontFamily').trim() || 'Courier',
    color: rootStyles.getPropertyValue('--font-color').trim() || '#fff'
  }

  return {
    ...defaultStyle,
    ...override
  }
}

export const config = {
  bgColor: {
    overworld: 0x5C94FC,
    underworld: 0x00000,
    underwater: 0x2038ec,
  },
  fSize: thisfontSize
}

export const controlKeys = {
  JUMP: null,
  DOWN: null,
  LEFT: null,
  RIGHT: null,
  FIRE: null,
  PAUSE: null

}
