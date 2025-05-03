export function checkControls ({ mario, keys }) {
  const isMarioTouchingFloor = mario.body.touching.down

  const isLeftKeyDown = keys.left.isDown
  const isRightKeyDown = keys.right.isDown
  const isUpKeyDown = keys.up.isDown

  if (mario.isDead) return

  if (isLeftKeyDown) {
    isMarioTouchingFloor && mario.anims.play('mario-walk', true)
    mario.x -= 2
    mario.flipX = true // Voltear el sprite de Mario horizontalmente.
  } else if (isRightKeyDown) {
    isMarioTouchingFloor && mario.anims.play('mario-walk', true)
    mario.x += 2
    mario.flipX = false // Restaurar la orientación original del sprite de Mario.
  } else if (isMarioTouchingFloor) {
    mario.anims.play('mario-idle', true) // Reproducir la animación de inactividad.
  }

  if (isUpKeyDown && isMarioTouchingFloor) {
    mario.setVelocityY(-300) // Aplicar una velocidad negativa en el eje Y para simular un salto.
    mario.anims.play('mario-jump', true) // Reproducir la animación de salto.
  }
}
