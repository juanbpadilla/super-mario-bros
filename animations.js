export const createAnimations = (game) => {
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
    key: 'mario-idle',
    frames: [{ key: 'mario', frame: 0 }],
  })

  game.anims.create({
    key: 'mario-jump',
    frames: [{ key: 'mario', frame: 5 }],
  })

  game.anims.create({
    key: 'mario-dead',
    frames: [{ key: 'mario', frame: 4 }],
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
}
