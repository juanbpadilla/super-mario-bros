export function createAnimations () {
  const { anims } = this
  anims.create({
    key: 'mario-idle',
    frames: [{ key: 'mario', frame: 0 }],
  })

  anims.create({
    key: 'mario-walk',
    frames: anims.generateFrameNumbers(
      'mario',
      { start: 1, end: 3 } // Generar fotogramas de la animación desde el sprite Mario.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1, // Repetir la animación indefinidamente.
  })

  anims.create({
    key: 'mario-dead',
    frames: [{ key: 'mario', frame: 4 }],
  })

  anims.create({
    key: 'mario-jump',
    frames: [{ key: 'mario', frame: 5 }],
  })

  anims.create({
    key: 'mario-grown-idle',
    frames: [{ key: 'mario-grown', frame: 0 }],
  })

  anims.create({
    key: 'mario-grown-walk',
    frames: anims.generateFrameNumbers(
      'mario-grown',
      { start: 1, end: 3 } // Generar fotogramas de la animación desde el sprite Mario.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1, // Repetir la animación indefinidamente.
  })

  anims.create({
    key: 'mario-grown-crouch',
    frames: [{ key: 'mario-grown', frame: 4 }],
  })

  anims.create({
    key: 'mario-grown-jump',
    frames: [{ key: 'mario-grown', frame: 5 }],
  })

  anims.create({
    key: 'mario-fire-idle',
    frames: [{ key: 'mario-fire', frame: 0 }],
  })

  anims.create({
    key: 'mario-fire-walk',
    frames: anims.generateFrameNumbers(
      'mario-fire',
      { start: 1, end: 3 } // Generar fotogramas de la animación desde el sprite Mario.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1,
  })

  anims.create({
    key: 'mario-fire-crouch',
    frames: [{ key: 'mario-fire', frame: 4 }],
  })

  anims.create({
    key: 'mario-fire-jump',
    frames: [{ key: 'mario-fire', frame: 5 }],
  })

  anims.create({
    key: 'mario-fire-throw',
    frames: [{ key: 'mario-fire', frame: 6 }],
  })

  anims.create({
    key: 'goomba-walk',
    frames: anims.generateFrameNumbers(
      'goomba',
      { start: 0, end: 1 } // Generar fotogramas de la animación desde el sprite Goomba.
    ),
    frameRate: 12, // Velocidad de la animación (fotogramas por segundo).
    repeat: -1, // Repetir la animación indefinidamente.
  })

  anims.create({
    key: 'goomba-hurt',
    frames: [{ key: 'goomba', frame: 2 }]
  })

  anims.create({
    key: 'coin-idle',
    frames: anims.generateFrameNumbers(
      'coin',
      { start: 0, end: 3 }
    ),
    frameRate: 12,
    repeat: -1
  })

  // > Ground coin
  anims.create({
    key: 'ground-coin-default',
    frames: anims.generateFrameNumbers('ground-coin', { start: 2, end: 0 }),
    frameRate: 5,
    repeat: -1,
    repeatDelay: 5
  })

  // > Mistery blocks
  anims.create({
    key: 'mistery-block-default',
    frames: anims.generateFrameNumbers('mistery-block', { start: 2, end: 0 }),
    frameRate: 5,
    repeat: -1,
    repeatDelay: 5
  })

  anims.create({
    key: 'custom-block-default',
    frames: anims.generateFrameNumbers('custom-block', { start: 2, end: 0 }),
    frameRate: 5,
    repeat: -1,
    repeatDelay: 5
  })

  // > Brick debris
  anims.create({
    key: 'brick-debris-default',
    frames: anims.generateFrameNumbers('brick-debris', { start: 0, end: 3 }),
    frameRate: 4,
    repeat: -1,
  })

  // > NPC
  anims.create({
    key: 'npc-default',
    frames: anims.generateFrameNumbers('npc', { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1,
    repeatDelay: 10
  })

  anims.create({
    key: 'supermushroom-idle',
    frames: [{ key: 'supermushroom', frame: 0 }]
  })

  // > Fireball
  anims.create({
    key: 'fireball-left-down',
    frames: [{ key: 'fireball', frame: 0 }]
  })
  anims.create({
    key: 'fireball-left-up',
    frames: [{ key: 'fireball', frame: 1 }]
  })
  anims.create({
    key: 'fireball-right-down',
    frames: [{ key: 'fireball', frame: 2 }]
  })
  anims.create({
    key: 'fireball-right-up',
    frames: [{ key: 'fireball', frame: 3 }]
  })

  // > Fireball explosion
  anims.create({
    key: 'fireball-explosion-1',
    frames: [{ key: 'fireball-explosion', frame: 0 }]
  })
  anims.create({
    key: 'fireball-explosion-2',
    frames: [{ key: 'fireball-explosion', frame: 1 }]
  })
  anims.create({
    key: 'fireball-explosion-3',
    frames: [{ key: 'fireball-explosion', frame: 2 }]
  })
}
