/* global Phaser */
import { platformPiecesWidth, screenWidth, worldHolesCoords, worldWidth } from '../config/index.js'

export function generateRandomCoordinate (entitie = false, ground = true) {
  const startPos = entitie ? screenWidth * 1.5 : screenWidth
  const endPos = entitie ? worldWidth - screenWidth * 3 : worldWidth

  const coordinate = Phaser.Math.Between(startPos, endPos)

  if (!ground) return coordinate

  for (const hole of worldHolesCoords) {
    if (coordinate >= hole.start - platformPiecesWidth * 1.5 && coordinate <= hole.end) {
      return generateRandomCoordinate.call(this, entitie, ground)
    }
  }

  return coordinate
}
