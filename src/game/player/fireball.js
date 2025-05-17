import { levelGravity, playerOptions, screenHeight, velocityX, velocityY } from '../services/config.js'
import { MARIO_ANIMATIONS } from '../services/mario_animations.js'
import { addToScore } from '../ui/hudManager.js'

export function throwFireball () {
  const game = this.scene
  const player = this.sprite

  game.fireballSound.play()
  player.anims.play(MARIO_ANIMATIONS[player.state].throw)

  game.playerFiring = true
  game.fireInCooldown = true

  setTimeout(() => { game.playerFiring = false }, 100)
  setTimeout(() => { game.fireInCooldown = false }, 350)

  const x = player.getBounds().x + (player.width * 1.15)
  const y = player.getBounds().y + (player.height * 1.25)

  const fireball = game.physics.add.sprite(x, y, 'fireball').setScale(screenHeight / 376)
  fireball.allowGravity = true
  fireball.dead = false
  fireball.exploded = false

  const isRight = playerOptions.playerController.direction.positive
  fireball.setVelocityX((isRight ? 1 : -1) * velocityX * 1.3)
  fireball.isVelocityPositive = isRight
  fireball.anims.play(isRight ? 'fireball-right-down' : 'fireball-left-down')

  updateFireballAnimation.call(this, fireball)

  const fireballBounceBound = fireballBounce.bind(this)
  const fireballCollidesBound = fireballCollides.bind(this)

  const colliderGroups = [
    game.blocksGroup,
    game.misteryBlocksGroup,
    game.platformGroup,
    game.immovableBlocksGroup,
    game.constructionBlocksGroup
  ]

  colliderGroups.forEach(group => {
    game.physics.add.collider(fireball, group.getChildren(), fireballBounceBound)
  })

  game.physics.add.overlap(fireball, game.goombasGroup.getChildren(), fireballCollidesBound)
}

function fireballCollides (fireball, entity) {
  // const game = this.scene
  const { scene: game } = this
  if (fireball.exploded || fireball.dead) return

  fireball.exploded = fireball.dead = true
  fireball.body.moves = false

  explodeFireball.call(this, fireball)

  game.kickSound.play()
  entity.anims.play('goomba-idle', true).flipY = true
  entity.dead = true
  game.goombasGroup.remove(entity)

  // entity.setVelocityX(0)
  // entity.setVelocityY(-velocityY * 0.4)
  entity.setVelocity(0, -velocityY * 0.4)

  setTimeout(() => {
    game.tweens.add({
      targets: entity,
      duration: 750,
      y: screenHeight * 1.1
    })
  }, 400)

  addToScore.call(game, 100, entity)
  setTimeout(() => { entity.destroy() }, 1250)
}

function explodeFireball (fireball) {
  const playExplosionFrame = (frame, delay) =>
    new Promise(resolve => setTimeout(() => {
      if (fireball) fireball.anims.play(frame, true)
      resolve()
    }, delay))

  Promise.resolve()
    .then(() => playExplosionFrame('fireball-explosion-1', 0))
    .then(() => playExplosionFrame('fireball-explosion-2', 50))
    .then(() => playExplosionFrame('fireball-explosion-3', 35))
    .then(() => setTimeout(() => fireball?.destroy(), 45))
}

function updateFireballAnimation (fireball) {
  if (fireball.exploded || fireball.dead) return

  const isFalling = fireball.body.velocity.y > 0
  const anim = fireball.isVelocityPositive
    ? isFalling ? 'fireball-right-up' : 'fireball-right-down'
    : isFalling ? 'fireball-left-up' : 'fireball-left-down'

  fireball.anims.play(anim)

  setTimeout(() => updateFireballAnimation.call(this, fireball), 250)
}

function fireballBounce (fireball, collider) {
  const { scene: game } = this

  const hitSide = fireball.body.blocked.left || fireball.body.blocked.right
  const hitTop = fireball.body.blocked.up
  const hitBottom = fireball.body.blocked.down

  if (hitSide) {
    fireball.exploded = fireball.dead = true
    fireball.body.moves = false

    game.blockBumpSound.play()
    return explodeFireball.call(this, fireball)
  }
  // console.log('fireball.body.velocity.x:' + fireball.body.velocity.x)
  // console.log('new velocity.x:' + velocityX * 1.4)

  if (hitBottom) {
    fireball.setVelocityY(-levelGravity / 4.5)
  } else if (hitTop) {
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
