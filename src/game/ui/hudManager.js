import { playerOptions, screenHeight, screenWidth, config, getTextStyle } from '../services/config.js'

let { timeLeft, score } = playerOptions
const { fSize } = config
const { localStorage } = window

export function createHUD () {
  const posY = screenWidth / 23

  // const textStyle = { fontFamily: 'pixel', fontSize: fSize, align: 'center', color: '#fafafa' }
  const textStyle = getTextStyle({ fontSize: fSize, align: 'center' })

  this.scoreText = this.add.text(screenWidth / 40, posY, '', textStyle)
  this.scoreText.setScrollFactor(0).depth = 5

  this.highScoreText = this.add.text(screenWidth / 2, posY, 'HIGH SCORE\n 0', textStyle).setOrigin(0.5, 0)
  this.highScoreText.setScrollFactor(0).depth = 5

  this.timeLeftText = this.add.text(screenWidth * 0.925, posY, 'TIME\n' + timeLeft.toString().padStart(3, '0'), textStyle)
  this.timeLeftText.setScrollFactor(0).depth = 5

  const localHighScore = localStorage.getItem('high-score')
  if (localHighScore !== null) {
    this.highScoreText.setText(`HIGH SCORE\n${localHighScore}`)
  }

  updateScore.call(this)
}

export function updateScore () {
  if (!this.scoreText) return

  this.scoreText.setText(`MARIO\n${score}`)
}

export function updateTimer () {
  const player = this.mario.sprite

  if (timeLeft <= 0 || player.isBlocked || this.isPaused) return

  if (timeLeft === 100) {
    this.musicTheme.stop()
    this.undergroundMusicTheme.stop()
    this.timeWarningSound.play()
    setTimeout(() => { this.hurryMusicTheme.play() }, 2400)
  }

  if (!this.timeLeftText.stopped) {
    timeLeft--
    this.timeLeftText.setText('TIME\n' + timeLeft.toString().padStart(3, '0'))
  }

  setTimeout(() => updateTimer.call(this), 500)
}

export function addToScore (scoreAdd, origin) {
  for (let i = 1; i <= scoreAdd; i++) {
    setTimeout(() => {
      score++
      updateScore.call(this)
    }, i)
  }

  if (!origin) return

  const scoreText = this.add.text(origin.getBounds().x, origin.getBounds().y, scoreAdd, {
    fontFamily: 'pixel',
    fontSize: 16,
    align: 'center'
  })

  scoreText.setOrigin(0).smoothed = true
  scoreText.depth = 5

  this.tweens.add({
    targets: scoreText,
    duration: 600,
    y: scoreText.y - screenHeight / 6.5,
    onComplete: () => {
      this.tweens.add({
        targets: scoreText,
        duration: 100,
        alpha: 0,
        onComplete: () => {
          scoreText.destroy()
        }
      })
    }
  })
}
