import { addToScore, killMario } from '../../game.js'
import { levelGravity, platformHeight, screenHeight, screenWidth, velocityY, worldWidth } from '../services/config.js'
import { generateRandomCoordinate } from '../services/randomCoordinate.js'
/* global Phaser */

const goombasVelocityX = screenWidth / 19

export function createEnemies () {
  const mario = this.mario.sprite
  this.goombasGroup = this.add.group()

  for (let i = 0; i < Math.trunc(worldWidth / 960); i++) {
    const x = generateRandomCoordinate(true)
    const goomba = this.physics.add
      .sprite(x, screenHeight - platformHeight, 'goomba')
      .setOrigin(0.5, 1)
      .setBounce(1, 0)
      .setScale(screenHeight / 376)
    goomba.anims.play('goomba-walk', true)
    goomba.smoothed = true
    goomba.depth = 2

    if (Phaser.Math.Between(0, 10) <= 4) {
      goomba.setVelocityX(goombasVelocityX)
    } else {
      goomba.setVelocityX(-goombasVelocityX)
    }

    goomba.setMaxVelocity(goombasVelocityX, levelGravity)
    this.goombasGroup.add(goomba)

    const platformPieces = this.platformGroup.getChildren()
    this.physics.add.collider(goomba, platformPieces)

    const blocks = this.blocksGroup.getChildren()
    this.physics.add.collider(goomba, blocks)

    const misteryBlocks = this.misteryBlocksGroup.getChildren()
    this.physics.add.collider(goomba, misteryBlocks)

    const goombas = this.goombasGroup.getChildren()
    this.physics.add.collider(goomba, goombas)
    this.physics.add.collider(goomba, this.finalFlagMast)
    this.physics.add.overlap(mario, goomba, onHitEnemy, null, this)
  }

  this.physics.add.collider(this.goombasGroup.getChildren(), this.immovableBlocksGroup.getChildren())
  this.physics.add.collider(this.goombasGroup.getChildren(), this.fallProtectionGroup.getChildren())
  this.physics.add.collider(this.goombasGroup.getChildren(), this.finalTrigger)

  setInterval(clearEnemies.call(this), 250)
}

function onHitEnemy (mario, enemy) {
  const enemyBeingCrushed = mario.body.touching.down && enemy.body.touching.up

  if (this.flagRaised) return

  if (mario.isInvulnerable) {
    if (!enemyBeingCrushed) return
  }

  if (enemyBeingCrushed) {
    enemy.anims.play('goomba-hurt', true)
    enemy.body.enable = false
    this.goombasGroup.remove(enemy)
    this.goombaStompSound.play()
    enemy.setVelocityX(0)
    addToScore.call(this, 200, enemy)
    mario.setVelocityY(-velocityY / 1.5)

    setTimeout(() => {
      this.tweens.add({
        targets: enemy,
        duration: 300,
        alpha: 0
      })
    }, 200)

    setTimeout(() => {
      enemy.destroy()
    }, 500)

    return
  }

  killMario.call(this)
}

function clearEnemies () {
  const goombas = this.goombasGroup.getChildren()

  for (let i = 0; i < goombas.length; i++) {
    if (goombas[i].body.velocity.x === 0 || (goombas[i].body.velocity.x > 0 && goombas[i].body.velocity.x !== goombasVelocityX) || (goombas[i].body.velocity.x < 0 && goombas[i].body.velocity.x !== -goombasVelocityX)) {
      this.goombasGroup.remove(goombas[i])
      goombas[i].destroy()
    }
  }
}
