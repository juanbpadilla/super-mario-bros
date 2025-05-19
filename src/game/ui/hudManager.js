import { playerOptions, screenHeight, screenWidth, config, getTextStyle, worldWidth } from '../../config/index.js'
import { getScreenshot } from '../../utils/screenshot.js'

let { timeLeft, score } = playerOptions
const { fSize } = config
const { localStorage, location } = window

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

  if (!this.timeLeftText || timeLeft <= 0 || player.isBlocked || this.timeLeftText.stopped || this.isPaused) return

  if (timeLeft === 100) {
    this.musicTheme.stop()
    this.undergroundMusicTheme.stop()
    this.timeWarningSound.play()
    setTimeout(() => { this.hurryMusicTheme.play() }, 2400)
  }

  if (!this.timeLeftText.stopped) {
    playerOptions.timeLeft--
    this.timeLeftText.setText('TIME\n' + playerOptions.timeLeft.toString().padStart(3, '0'))
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

export function gameOverScreen (outOfTime = false) {
  if (localStorage.getItem('high-score') !== null) {
    if (localStorage.getItem('high-score') < score) {
      localStorage.setItem('high-score', score)
      this.highScoreText.setText(`NEW HIGH SCORE!\n${score}`)
    }
  } else {
    localStorage.setItem('high-score', score)
  }

  const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
  const gameOverScreen = this.add.rectangle(0, screenHeight / 2, worldWidth, screenHeight, 0x000000)
    .setScrollFactor(0)
  gameOverScreen.alpha = 0
  gameOverScreen.depth = 4
  this.tweens.add({
    targets: gameOverScreen,
    duration: 200,
    alpha: 1
  })
  this.add.bitmapText(screenCenterX, screenHeight / 3, 'carrier_command', outOfTime ? 'TIME UP' : 'GAME OVER', screenWidth / 30).setOrigin(0.5).depth = 5
  this.add.bitmapText(screenCenterX, screenHeight / 2, 'carrier_command', '> PLAY AGAIN', screenWidth / 50).setOrigin(0.5).setInteractive().on('pointerdown', () => location.reload()).depth = 5
  this.add.bitmapText(screenCenterX, screenHeight / 1.7, 'carrier_command', '> SCREENSHOT', screenWidth / 50).setOrigin(0.5).setInteractive().on('pointerdown', () => getScreenshot()).depth = 5
}

export function winScreen () {
  if (localStorage.getItem('high-score') !== null) {
    if (localStorage.getItem('high-score') < score) {
      localStorage.setItem('high-score', score)
      this.highScoreText.setText('NEW HIGH SCORE!\n' + score.toString().padStart(6, '0'))
    }
  } else {
    localStorage.setItem('high-score', score)
    this.highScoreText.setText('NEW HIGH SCORE!\n' + score.toString().padStart(6, '0'))
  }

  const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
  const winScreen = this.add.rectangle(0, screenHeight / 2, worldWidth, screenHeight, 0x000000).setScrollFactor(0)
  winScreen.alpha = 0
  winScreen.depth = 4
  this.tweens.add({
    targets: winScreen,
    duration: 300,
    alpha: 1
  })
  this.add.bitmapText(screenCenterX, screenHeight / 3, 'carrier_command', 'YOU WON!', screenWidth / 30).setOrigin(0.5).depth = 5
  this.add.bitmapText(screenCenterX, screenHeight / 2, 'carrier_command', '> PLAY AGAIN', screenWidth / 50).setOrigin(0.5).setInteractive().on('pointerdown', () => location.reload()).depth = 5
  this.add.bitmapText(screenCenterX, screenHeight / 1.7, 'carrier_command', '> SCREENSHOT', screenWidth / 50).setOrigin(0.5).setInteractive().on('pointerdown', () => getScreenshot()).depth = 5
}
