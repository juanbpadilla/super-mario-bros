/* global Phaser */
import { playAudio } from '../../audio.js'
import { controlKeys, emptyBlocksList, screenHeight, screenWidth } from '../services/config.js'

const mushroomsVelocityX = screenWidth / 15

export function revealHiddenBlock (player, block) {
  if (!player.body.blocked.up) { return }

  playAudio('block-bump', this, { volume: 0.3 })

  if (emptyBlocksList.includes(block)) { return }

  emptyBlocksList.push(block)
  block.anims.stop()
  block.setTexture('emptyBlock')
  this.tweens.add({
    targets: block,
    duration: 75,
    start: performance.now(),
    y: block.y - screenHeight / 34.5,
    onComplete: () => {
      this.tweens.add({
        targets: block,
        duration: 75,
        start: performance.now(),
        y: block.y + screenHeight / 34.5
      })
    },
    onCompleteScope: this
  })

  const random = Phaser.Math.Between(0, 100)
  if (random < 90) {
    // addToScore.call(this, 200, block)
    // this.coinSound.play()
    playAudio('coin-pickup', this, { volume: 0.1 })
    const coin = this.physics.add.sprite(block.getBounds().x, block.getBounds().y, 'coin').setScale(screenHeight / 357)
      .setOrigin(0)
      .anims.play('coin-idle')
    coin.immovable = true
    coin.smoothed = true
    coin.depth = 0

    this.tweens.add({
      targets: coin,
      duration: 250,
      start: performance.now(),
      y: coin.y - (screenHeight / 8.25),
      onComplete: () => {
        this.tweens.add({
          targets: coin,
          duration: 250,
          start: performance.now(),
          y: coin.y + (screenHeight / 10.35),
          onComplete: () => {
            coin.destroy()
          }
        })
      },
      onCompleteScope: this
    })
  } else if (random >= 90 && random < 96) {
    this.powerUpAppearsSound.play()
    const mushroom = this.physics.add.sprite(block.getBounds().x, block.getBounds().y, 'super-mushroom').setScale(screenHeight / 345).setOrigin(0).setBounce(1, 0)
    this.tweens.add({
      targets: mushroom,
      duration: 300,
      start: performance.now(),
      y: mushroom.y - (screenHeight / 20),
      onComplete: function () {
        if (!mushroom) { return }

        if (Phaser.Math.Between(0, 10) <= 4) {
          mushroom.setVelocityX(mushroomsVelocityX)
        } else {
          mushroom.setVelocityX(-mushroomsVelocityX)
        }
      },
      onCompleteScope: this
    })
    // this.physics.add.overlap(player, mushroom, consumeMushroom, null, this)
    // this.physics.add.collider(mushroom, this.misteryBlocksGroup.getChildren())
    // this.physics.add.collider(mushroom, this.blocksGroup.getChildren())
    // this.physics.add.collider(mushroom, this.platformGroup.getChildren())
    // this.physics.add.collider(mushroom, this.immovableBlocksGroup.getChildren())
    // this.physics.add.collider(mushroom, this.constructionBlocksGroup.getChildren())
  } else {
    this.powerUpAppearsSound.play()
    const fireFlower = this.physics.add.sprite(block.getBounds().x, block.getBounds().y, 'fire-flower').setScale(screenHeight / 345).setOrigin(0)
    fireFlower.body.immovable = true
    fireFlower.body.allowGravity = false
    fireFlower.anims.play('fire-flower-default', true)
    this.tweens.add({
      targets: fireFlower,
      duration: 300,
      start: performance.now(),
      y: fireFlower.y - (screenHeight / 23)
    })
    // this.physics.add.overlap(player, fireFlower, consumeFireflower, null, this)
    const misteryBlocks = this.misteryBlocksGroup.getChildren()
    this.physics.add.collider(fireFlower, misteryBlocks)
  }
}

export function destroyBlock (player, block) {
  if (!player.body.blocked.up) { return }

  playAudio('block-bump', this, { volume: 0.3 })
  if (player.state === 0 && !block.isImmovable) {
    this.tweens.add({
      targets: block,
      duration: 75,
      start: performance.now(),
      y: block.y - screenHeight / 69,
      onComplete: () => {
        this.tweens.add({
          targets: block,
          duration: 75,
          start: performance.now(),
          y: block.y + screenHeight / 69
        })
      },
      onCompleteScope: this
    })
  }

  if (player.state > 0 && !(controlKeys.DOWN.isDown)) {
    playAudio('break-block', this, { volume: 0.5 })
    // addToScore.call(this, 50)
    drawDestroyedBlockParticles.call(this, block)
    block.destroy()
  }
}

export function drawDestroyedBlockParticles (block) {
  const { player } = this.mario
  const playerBounds = player.getBounds()
  const blockBounds = block.getBounds()

  const particles = [
    [playerBounds.left, blockBounds.y],
    [playerBounds.right, blockBounds.y],
    [playerBounds.left, blockBounds.y + block.height * 2.35],
    [playerBounds.right, blockBounds.y + block.height * 2.35]
  ]

  for (const particleCoords of particles) {
    const particle = this.physics.add.sprite(particleCoords[0], particleCoords[1], 'brick-debris').anims.play('brick-debris-default', true)

    if (particleCoords[1] === blockBounds.y) {
      particle.setVelocityY(-(screenHeight / 3.45))
    } else {
      particle.setVelocityY(-(screenHeight / 2.6))
    }

    particle.setVelocityX(particleCoords[0] === playerBounds.left ? -(screenWidth / 25.6) : (screenWidth / 25.6))
    particle.setScale(screenHeight / 517)
    particle.depth = 4
  }

  setTimeout(() => {
    for (const particleCoords of particles) {
      this.physics.world.disableBody(particleCoords[0], particleCoords[1])
    }
  }, 3000)
}
