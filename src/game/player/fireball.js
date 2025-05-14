import { addToScore } from '../../game.js'
import { levelGravity, playerOptions, screenHeight, velocityX, velocityY } from '../services/config.js'
import { MARIO_ANIMATIONS } from '../services/mario_animations.js'

export function throwFireball () {
  const game = this.scene
  const player = this.sprite

  game.fireballSound.play()
  player.anims.play(MARIO_ANIMATIONS[player.state].throw)
  game.playerFiring = true
  game.fireInCooldown = true
  setTimeout(() => {
    game.playerFiring = false
  }, 100)

  setTimeout(() => {
    game.fireInCooldown = false
  }, 350)

  const fireball = game.physics.add.sprite(player.getBounds().x + (player.width * 1.15), player.getBounds().y + (player.height / 1.25), 'fireball').setScale(screenHeight / 345)
  fireball.allowGravity = true
  fireball.dead = false
  if (playerOptions.playerController.direction.positive) {
    fireball.setVelocityX(velocityX * 1.3)
    fireball.isVelocityPositive = true
    fireball.anims.play('fireball-right-down')
  } else {
    fireball.setVelocityX(-velocityX * 1.3)
    fireball.isVelocityPositive = false
    fireball.anims.play('fireball-left-down')
  }

  updateFireballAnimation.call(this, fireball)
  game.physics.add.collider(fireball, game.blocksGroup.getChildren(), fireballBounce, null, this)
  game.physics.add.collider(fireball, game.misteryBlocksGroup.getChildren(), fireballBounce, null, this)
  game.physics.add.collider(fireball, game.platformGroup.getChildren(), fireballBounce, null, this)
  game.physics.add.overlap(fireball, game.goombasGroup.getChildren(), fireballCollides, null, this)
  game.physics.add.collider(fireball, game.immovableBlocksGroup.getChildren(), fireballBounce, null, this)
  game.physics.add.collider(fireball, game.constructionBlocksGroup.getChildren(), fireballBounce, null, this)
}

function fireballCollides (fireball, entitie) {
  const game = this.scene
  if (fireball.exploded || fireball.dead) { return }

  fireball.exploded = true
  fireball.dead = true
  fireball.body.moves = false

  explodeFireball.call(this, fireball)

  game.kickSound.play()

  entitie.anims.play('goomba-idle', true).flipY = true
  entitie.dead = true
  game.goombasGroup.remove(entitie)
  entitie.setVelocityX(0)
  entitie.setVelocityY(-velocityY * 0.4)
  setTimeout(() => {
    game.tweens.add({
      targets: entitie,
      duration: 750,
      y: screenHeight * 1.1
    })
  }, 400)

  addToScore.call(game, 100, entitie)
  setTimeout(() => {
    entitie.destroy()
  }, 1250)
}

function explodeFireball (fireball) {
  fireball.anims.play('fireball-explosion-1', true)

  const destroyFireball = () => {
    if (fireball) {
      fireball.destroy()
    }
  }

  Promise.resolve()
    .then(() => new Promise(resolve => setTimeout(() => {
      if (fireball) {
        fireball.anims.play('fireball-explosion-2', true)
      }
      resolve()
    }, 50)))
    .then(() => new Promise(resolve => setTimeout(() => {
      if (fireball) {
        fireball.anims.play('fireball-explosion-3', true)
      }
      resolve()
    }, 35)))
    .then(() => new Promise(resolve => setTimeout(() => {
      destroyFireball()
      resolve()
    }, 45)))
}

function updateFireballAnimation (fireball) {
  if (fireball.exploded || fireball.dead) return

  if (fireball.body.velocity.y > 0) {
    if (fireball.isVelocityPositive) {
      fireball.anims.play('fireball-right-up')
    } else {
      fireball.anims.play('fireball-left-up')
    }
  } else {
    if (fireball.isVelocityPositive) {
      fireball.anims.play('fireball-right-down')
    } else {
      fireball.anims.play('fireball-left-down')
    }
  }

  setTimeout(() => {
    updateFireballAnimation.call(this, fireball)
  }, 250)
}

function fireballBounce (fireball, collider) {
  const game = this.scene
  if ((collider.isPlatform && (fireball.body.blocked.left || fireball.body.blocked.right)) || (!collider.isPlatform && (fireball.body.blocked.left || fireball.body.blocked.right))) {
    fireball.exploded = true
    fireball.dead = true
    fireball.body.moves = false

    game.blockBumpSound.play()
    explodeFireball.call(this, fireball)
    return
  }

  if (fireball.body.blocked.down) {
    fireball.setVelocityY(-levelGravity / 3.45)
  }

  if (fireball.body.blocked.up) {
    fireball.setVelocityY(levelGravity / 3.45)
  }

  if (fireball.body.blocked.left) {
    fireball.isVelocityPositive = false
    fireball.setVelocityX(velocityX * 1.3)
  }

  if (fireball.body.blocked.right) {
    fireball.isVelocityPositive = true
    fireball.setVelocityX(-velocityX * 1.3)
  }
}
