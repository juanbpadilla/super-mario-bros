export const createAnimations = (game) => {
  game.anims.create({
    key: 'mario-idle',
    frames: [{ key: 'mario', frame: 0 }],
  })

  game.anims.create({
    key: 'mario-walk',
    frames: game.anims.generateFrameNumbers(
      'mario',
      { start: 1, end: 3 } // Generar fotogramas de la animación desde el sprite Mario.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1, // Repetir la animación indefinidamente.
  })

  game.anims.create({
    key: 'mario-dead',
    frames: [{ key: 'mario', frame: 4 }],
  })

  game.anims.create({
    key: 'mario-jump',
    frames: [{ key: 'mario', frame: 5 }],
  })

  game.anims.create({
    key: 'mario-grown-idle',
    frames: [{ key: 'mario-grown', frame: 0 }],
  })

  game.anims.create({
    key: 'mario-grown-walk',
    frames: game.anims.generateFrameNumbers(
      'mario-grown',
      { start: 1, end: 3 } // Generar fotogramas de la animación desde el sprite Mario.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1, // Repetir la animación indefinidamente.
  })

  game.anims.create({
    key: 'mario-grown-crouch',
    frames: [{ key: 'mario-grown', frame: 4 }],
  })

  game.anims.create({
    key: 'mario-grown-jump',
    frames: [{ key: 'mario-grown', frame: 5 }],
  })

  game.anims.create({
    key: 'mario-fire-idle',
    frames: [{ key: 'mario-fire', frame: 0 }],
  })

  game.anims.create({
    key: 'mario-fire-walk',
    frames: game.anims.generateFrameNumbers(
      'mario-fire',
      { start: 1, end: 3 } // Generar fotogramas de la animación desde el sprite Mario.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1,
  })

  game.anims.create({
    key: 'mario-fire-crouch',
    frames: [{ key: 'mario-fire', frame: 4 }],
  })

  game.anims.create({
    key: 'mario-fire-jump',
    frames: [{ key: 'mario-fire', frame: 5 }],
  })

  game.anims.create({
    key: 'mario-fire-throw',
    frames: [{ key: 'mario-fire', frame: 6 }],
  })

  game.anims.create({
    key: 'goomba-walk',
    frames: game.anims.generateFrameNumbers(
      'goomba',
      { start: 0, end: 1 } // Generar fotogramas de la animación desde el sprite Goomba.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1, // Repetir la animación indefinidamente.
  })

  game.anims.create({
    key: 'goomba-hurt',
    frames: [{ key: 'goomba', frame: 2 }]
  })

  game.anims.create({
    key: 'coin-idle',
    frames: game.anims.generateFrameNumbers(
      'coin',
      { start: 0, end: 3 }
    ),
    frameRate: 12,
    repeat: -1
  })

  // > Mistery blocks
  game.anims.create({
    key: 'mistery-block-default',
    frames: game.anims.generateFrameNumbers('mistery-block', { start: 2, end: 0 }),
    frameRate: 5,
    repeat: -1,
    repeatDelay: 5
  })

  game.anims.create({
    key: 'custom-block-default',
    frames: game.anims.generateFrameNumbers('custom-block', { start: 2, end: 0 }),
    frameRate: 5,
    repeat: -1,
    repeatDelay: 5
  })

  // > NPC
  game.anims.create({
    key: 'npc-default',
    frames: game.anims.generateFrameNumbers('npc', { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1,
    repeatDelay: 10
  })

  game.anims.create({
    key: 'supermushroom-idle',
    frames: [{ key: 'supermushroom', frame: 0 }]
  })
}
