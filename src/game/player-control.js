import { platformHeight, playerObtions, screenHeight, startOffset } from './services/config.js'

export function createPlayer () {
  // Draw player
  playerObtions.player = this.physics.add.sprite(/* screenWidth * 1.5 */ startOffset, screenHeight - platformHeight, 'mario')
    .setOrigin(1).setBounce(0)
    .setCollideWorldBounds(true).setScale(screenHeight / 376)
  playerObtions.player.depth = 3
  /* this.cameras.main.startFollow(player);
  playerState = 2; */
  // console.log('first :')
  // console.log(player)
}

export function decreasePlayerState () {
  if (playerObtions.playerState <= 0) {
    gameOver = true
    gameOverFunc.call(this)
    return
  }

  playerBlocked = true
  this.physics.pause()
  this.anims.pauseAll()
  this.powerDownSound.play()

  const anim1 = playerState == 2 ? 'fire-mario-idle' : 'grown-mario-idle'
  const anim2 = playerState == 2 ? 'grown-mario-idle' : 'idle'

  applyPlayerInvulnerability.call(this, 3000)
  player.anims.play(anim2)

  let i = 0
  const interval = setInterval(() => {
    i++
    player.anims.play(i % 2 === 0 ? anim2 : anim1)
    if (i > 5) {
      clearInterval(interval)
    }
  }, 100)

  playerState--

  setTimeout(() => {
    this.physics.resume()
    this.anims.resumeAll()
    playerBlocked = false
    updateTimer.call(this)
  }, 1000)
}
