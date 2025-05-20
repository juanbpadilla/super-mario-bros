import { playerOptions } from '../config/index.js'

/* global Phaser */

export const initAudio = ({ load }) => {
  const { levelStyle } = playerOptions
  const INIT_AUDIOS = [
    {
      key: 'music',
      path: 'assets/sound/music/overworld/theme.mp3',
    },
    {
      key: 'underground-music',
      path: 'assets/sound/music/underground/theme.mp3',
    },
    {
      key: 'hurry-up-music',
      path: 'assets/sound/music/' + levelStyle + '/hurry-up-theme.mp3',
    },
    {
      key: 'gameover',
      path: 'assets/sound/music/gameover.mp3',
    },
    {
      key: 'win',
      path: 'assets/sound/music/win.wav',
    },
    {
      key: 'coin-pickup',
      path: 'assets/sound/effects/coin.mp3',
    },
    {
      key: 'powerup-appears',
      path: 'assets/sound/effects/powerup-appears.mp3'
    },
    {
      key: 'powerup',
      path: 'assets/sound/effects/consume-powerup.mp3'
    },
    {
      key: 'powerdown',
      path: 'assets/sound/effects/powerdown.mp3'
    },
    {
      key: 'goomba-stomp',
      path: 'assets/sound/effects/goomba-stomp.wav',
    },
    {
      key: 'flagpole',
      path: 'assets/sound/effects/flagpole.mp3'
    },
    {
      key: 'fireball',
      path: 'assets/sound/effects/fireball.mp3'
    },
    {
      key: 'kick',
      path: 'assets/sound/effects/kick.mp3'
    },
    {
      key: 'time-warning',
      path: 'assets/sound/effects/time-warning.mp3'
    },
    {
      key: 'here-we-go',
      path: Phaser.Math.Between(0, 100) < 98 ? 'assets/sound/effects/here-we-go.mp3' : 'assets/sound/effects/cursed-here-we-go.mp3'
    },
    {
      key: 'pause',
      path: 'assets/sound/effects/pause.wav'
    },
    {
      key: 'jumpsound',
      path: 'assets/sound/effects/jump.mp3'
    },
    {
      key: 'block-bump',
      // path: 'assets/sound/effects/block-bump.wav'
      path: 'assets/sound/effects/firework.mp3'
    },
    {
      key: 'break-block',
      path: 'assets/sound/effects/break-block.wav'
    },
  ]
  INIT_AUDIOS.forEach(({ key, path }) => {
    load.audio(key, path)
  })
}

// export const playAudio = (id, { sound }, { volume = 1 } = {}) => {
//   try {
//     return sound.add(id, { volume }).play()
//   } catch (e) {
//     console.error(e)
//   }
// }

export const initSounds = (game) => {
  game.musicGroup = game.add.group()
  game.effectsGroup = game.add.group()

  game.musicTheme = game.sound.add('music', { volume: 0.2 })
  game.musicTheme.play({ loop: -1 })
  game.musicGroup.add(game.musicTheme)

  game.undergroundMusicTheme = game.sound.add('underground-music', { volume: 0.2 })
  game.musicGroup.add(game.undergroundMusicTheme)

  game.hurryMusicTheme = game.sound.add('hurry-up-music', { volume: 0.15 })
  game.musicGroup.add(game.hurryMusicTheme)

  game.gameOverSong = game.sound.add('gameover', { volume: 0.2 })
  game.musicGroup.add(game.gameOverSong)

  game.winSound = game.sound.add('win', { volume: 0.2 })
  game.musicGroup.add(game.winSound)

  game.jumpSound = game.sound.add('jumpsound', { volume: 0.12 })
  game.effectsGroup.add(game.jumpSound)

  game.coinSound = game.sound.add('coin-pickup', { volume: 0.2 })
  game.effectsGroup.add(game.coinSound)

  game.powerUpAppearsSound = game.sound.add('powerup-appears', { volume: 0.2 })
  game.effectsGroup.add(game.powerUpAppearsSound)

  game.consumePowerUpSound = game.sound.add('powerup', { volume: 0.2 })
  game.effectsGroup.add(game.consumePowerUpSound)

  game.powerDownSound = game.sound.add('powerdown', { volume: 0.3 })
  game.effectsGroup.add(game.powerDownSound)

  game.goombaStompSound = game.sound.add('goomba-stomp', { volume: 1 })
  game.effectsGroup.add(game.goombaStompSound)

  game.flagPoleSound = game.sound.add('flagpole', { volume: 0.3 })
  game.effectsGroup.add(game.flagPoleSound)

  game.fireballSound = game.sound.add('fireball', { volume: 0.3 })
  game.effectsGroup.add(game.fireballSound)

  game.kickSound = game.sound.add('kick', { volume: 0.3 })
  game.effectsGroup.add(game.kickSound)

  game.timeWarningSound = game.sound.add('time-warning', { volume: 0.2 })
  game.effectsGroup.add(game.timeWarningSound)

  game.hereWeGoSound = game.sound.add('here-we-go', { volume: 0.17 })
  game.effectsGroup.add(game.hereWeGoSound)

  game.pauseSound = game.sound.add('pause', { volume: 0.17 })
  game.effectsGroup.add(game.pauseSound)

  game.blockBumpSound = game.sound.add('block-bump', { volume: 0.3 })
  game.effectsGroup.add(game.blockBumpSound)

  game.breakBlockSound = game.sound.add('break-block', { volume: 0.5 })
  game.effectsGroup.add(game.breakBlockSound)
}
