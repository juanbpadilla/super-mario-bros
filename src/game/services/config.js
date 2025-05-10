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

// export let isLevelOverworld
// export const isLevelOverworld = true
// export const isLevelOverworld = Phaser.Math.Between(0, 100) <= 84
// isLevelOverworld = true

// export const levelStyle = isLevelOverworld ? 'overworld' : 'underground'

export const worldHolesCoords = []

export const emptyBlocksList = []

class PlayerOptions {
  constructor (playerController, isLevelOverworld, timeLeft) {
    this.playerController = playerController
    this.isLevelOverworld = isLevelOverworld
    this.levelStyle = this.isLevelOverworld ? 'overworld' : 'underground'
    this.timeLeft = timeLeft
  }

  setLevel (isLevelOverworld) {
    this.isLevelOverworld = isLevelOverworld
  }

  setLevelStyle () {
    this.levelStyle = this.isLevelOverworld ? 'overworld' : 'underground'
  }
}

// export const playerOptions = {
//   playerController: null,
//   isLevelOverworld: false,
//   levelStyle: null,
//   timeLeft: 300,
// }
export const playerOptions = new PlayerOptions(
  null,
  Phaser.Math.Between(0, 100) <= 84,
  300
)

export const controlKeys = {
  JUMP: null,
  DOWN: null,
  LEFT: null,
  RIGHT: null,
  FIRE: null,
  PAUSE: null

}
