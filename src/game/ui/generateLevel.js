/* global Phaser */
import { applyPlayerInvulnerability } from '../../player-controls.js'
import { playerOptions, platformHeight, platformPiecesWidth, platformPieces, screenHeight, screenWidth, worldWidth, worldHolesCoords } from '../services/config.js'
import { MARIO_ANIMATIONS } from '../services/mario_animations.js'
import { destroyBlock, revealHiddenBlock } from './blocks.js'
import { generateStructure } from './structures.js'

export function generateLevel () {
  const { isLevelOverworld } = playerOptions
  // > Creando la plataforma
  const player = this.mario

  // pieceStart será la siguiente posición de inicio de la pieza de la plataforma. Este valor se modificará después de cada ejecución.
  let pieceStart = screenWidth
  // Esto nos dirá si la última pieza de plataforma generada estaba vacía, para evitar generar otra pieza vacía a su lado.
  let lastWasHole = 0
  // Las estructuras generarán cada 2/3 piezas de plataforma
  let lastWasStructure = 0

  this.platformGroup = this.add.group()
  this.fallProtectionGroup = this.add.group()
  this.blocksGroup = this.add.group()
  this.constructionBlocksGroup = this.add.group()
  this.misteryBlocksGroup = this.add.group()
  this.immovableBlocksGroup = this.add.group()
  this.groundCoinsGroup = this.add.group()

  if (!isLevelOverworld) {
    // this.blocksGroup.add(this.add.tileSprite(worldWidth - screenWidth, screenHeight - (platformHeight * 4.5), screenWidth * 2.9, 16, 'block').setScale(screenHeight / 345).setOrigin(1, 0));
    this.blocksGroup.add(this.add.tileSprite(screenWidth, screenHeight - platformHeight / 1.2, 16, screenHeight - platformHeight, 'block2').setScale(screenHeight / 345).setOrigin(0, 1))
    this.undergroundRoof = this.add.tileSprite(screenWidth * 1.2, screenHeight / 13, worldWidth / 2.68, 16, 'block2').setScale(screenHeight / 345).setOrigin(0)
    this.blocksGroup.add(this.undergroundRoof)
  }

  for (let i = 0; i <= platformPieces; i++) {
    // Los agujeros tendrán un 10% de posibilidades de aparecer.
    const number = Phaser.Math.Between(0, 100)

    // Comprueba que no sea un agujero, esto significa que no es ese 20%, no está en la zona segura de aparición y no está cerca del castillo final.
    // Verifica si no se debe generar una nueva pieza de plataforma, evaluando:
    // - Si el inicio de la pieza está demasiado cerca del borde derecho del mundo,
    //   o si recientemente se generó un agujero o una estructura,
    // - O si no quedan piezas por colocar,
    // - O si la posición de inicio está muy cerca de los bordes izquierdo o derecho de la pantalla visible
    if (pieceStart >= (lastWasHole > 0 || lastWasStructure > 0 || worldWidth - platformPiecesWidth * 4) || number <= 0 || pieceStart <= screenWidth * 2 || pieceStart >= worldWidth - screenWidth * 2) {
      lastWasHole--

      // > Crear plataforma
      const Npiece = this.add.tileSprite(pieceStart, screenHeight, platformPiecesWidth, platformHeight, 'floorbricks')
        .setScale(2)
        .setOrigin(0, 0.5)
      this.physics.add.existing(Npiece)
      Npiece.body.immovable = true
      Npiece.body.allowGravity = false
      Npiece.isPlatform = true
      Npiece.depth = 2
      this.platformGroup.add(Npiece)
      // Aplicar colisión del jugador con la plataforma
      this.physics.add.collider(player, Npiece)

      // > Creando estructuras del mundo

      if (!(pieceStart >= (worldWidth - screenWidth * (isLevelOverworld ? 1 : 1.5))) && pieceStart > (screenWidth + platformPiecesWidth * 2) && lastWasHole < 1 && lastWasStructure < 1) {
        lastWasStructure = generateStructure.call(this, pieceStart)
      } else {
        lastWasStructure--
      }
    } else {
      // Guarda el inicio y el final de cada hoyo para usarlo más tarde.
      worldHolesCoords.push({
        start: pieceStart,
        end: pieceStart + platformPiecesWidth * 2
      })

      lastWasHole = 2
      this.fallProtectionGroup.add(this.add.rectangle(pieceStart + platformPiecesWidth * 2, screenHeight - platformHeight, 5, 5)
        .setOrigin(0, 1))
      this.fallProtectionGroup.add(this.add.rectangle(pieceStart, screenHeight - platformHeight, 5, 5)
        .setOrigin(1, 1))
    }
    pieceStart += platformPiecesWidth * 2
  }

  this.startScreenTrigger = this.add.tileSprite(screenWidth, screenHeight - platformHeight, 32, 28, 'horizontal-tube')
    .setScale(screenHeight / 345)
    .setOrigin(1, 1)
  this.startScreenTrigger.depth = 4
  this.physics.add.existing(this.startScreenTrigger)
  this.startScreenTrigger.body.allowGravity = false
  this.startScreenTrigger.body.immovable = true
  this.physics.add.collider(player, this.startScreenTrigger, startLevel, null, this)

  const invisibleWall2 = this.add.rectangle(screenWidth, screenHeight - platformHeight, 1, screenHeight).setOrigin(0.5, 1)
  this.physics.add.existing(invisibleWall2)
  invisibleWall2.body.allowGravity = false
  invisibleWall2.body.immovable = true
  this.physics.add.collider(this.mario, invisibleWall2)
  this.fallProtectionGroup.add(invisibleWall2)

  if (!isLevelOverworld) {
    this.verticalTube = this.add.tileSprite(worldWidth - screenWidth, screenHeight - platformHeight, 32, screenHeight, 'vertical-extralarge-tube').setScale(screenHeight / 345).setOrigin(1, 1)
    this.verticalTube.depth = 2
    this.physics.add.existing(this.verticalTube)
    this.verticalTube.body.allowGravity = false
    this.verticalTube.body.immovable = true
    this.physics.add.collider(player, this.verticalTube)

    this.finalTrigger = this.add.tileSprite(worldWidth - screenWidth * 1.03, screenHeight - platformHeight, 40, 31, 'horizontal-final-tube').setScale(screenHeight / 345).setOrigin(1, 1)
    this.finalTrigger.depth = 2
    this.physics.add.existing(this.finalTrigger)
    this.finalTrigger.body.allowGravity = false
    this.finalTrigger.body.immovable = true
    this.physics.add.collider(player, this.finalTrigger, teleportToLevelEnd, null, this)

    const invisibleWall1 = this.add.rectangle(worldWidth - screenWidth, screenHeight - platformHeight, 1, screenHeight).setOrigin(0.5, 1)
    this.physics.add.existing(invisibleWall1)
    invisibleWall1.body.allowGravity = false
    invisibleWall1.body.immovable = true
    this.physics.add.collider(player, invisibleWall1)
    this.fallProtectionGroup.add(invisibleWall1)
  }

  const fallProtections = this.fallProtectionGroup.getChildren()
  for (let i = 0; i < fallProtections.length; i++) {
    this.physics.add.existing(fallProtections[i])
    fallProtections[i].body.allowGravity = false
    fallProtections[i].body.immovable = true
  }

  // Establecer propiedades para cada estructura generada
  const misteryBlocks = this.misteryBlocksGroup.getChildren()
  for (let i = 0; i < misteryBlocks.length; i++) {
    this.physics.add.existing(misteryBlocks[i])
    misteryBlocks[i].body.allowGravity = false
    misteryBlocks[i].body.immovable = true
    misteryBlocks[i].depth = 2
    misteryBlocks[i].anims.play('mistery-block-default', true)
    this.physics.add.collider(player, misteryBlocks[i], revealHiddenBlock, null, this)
  }

  // Aplicar colisión de jugadores con bloques
  const blocks = this.blocksGroup.getChildren()
  for (let i = 0; i < blocks.length; i++) {
    this.physics.add.existing(blocks[i])
    blocks[i].body.allowGravity = false
    blocks[i].body.immovable = true
    blocks[i].depth = 2
    this.physics.add.collider(player, blocks[i], destroyBlock, null, this)
  }

  // Aplicar físicas a cada bloque del grupo de construcción
  // - Se les desactiva la gravedad y se marcan como inmóviles
  // - Se establece una colisión con el jugador que llama a la función destroyBlock
  const constructionBlocks = this.constructionBlocksGroup.getChildren()
  for (let i = 0; i < constructionBlocks.length; i++) {
    this.physics.add.existing(constructionBlocks[i])
    constructionBlocks[i].isImmovable = true
    constructionBlocks[i].body.allowGravity = false
    constructionBlocks[i].body.immovable = true
    constructionBlocks[i].depth = 2
    this.physics.add.collider(player, constructionBlocks[i], destroyBlock, null, this)
  }

  // Configurar bloques inmóviles del grupo:
  // - Se desactiva la gravedad y se marcan como inmóviles
  // - Se establece colisión con el jugador, sin función adicional
  const immovableBlocks = this.immovableBlocksGroup.getChildren()
  for (let i = 0; i < immovableBlocks.length; i++) {
    this.physics.add.existing(immovableBlocks[i])
    immovableBlocks[i].body.allowGravity = false
    immovableBlocks[i].body.immovable = true
    immovableBlocks[i].depth = 2
    this.physics.add.collider(player, immovableBlocks[i])
  }

  // Configurar monedas en el suelo:
  // - Se activa la animación por defecto de la moneda
  // - Se desactiva la gravedad y se hacen inmóviles
  // - Se detecta superposición con el jugador para ejecutar collectCoin
  const groundCoins = this.groundCoinsGroup.getChildren()
  for (let i = 0; i < groundCoins.length; i++) {
    this.physics.add.existing(groundCoins[i])
    groundCoins[i].anims.play('ground-coin-default', true)
    groundCoins[i].body.allowGravity = false
    groundCoins[i].body.immovable = true
    groundCoins[i].depth = 2
    this.physics.add.overlap(player, groundCoins[i], collectCoin, null, this)
  }
}

function startLevel (player, trigger) {
  // const player = this.mario
  // console.log(player)
  if (!player.body.blocked.right && !trigger.body.blocked.left) { return }
  console.log('start level')
  this.powerDownSound.play()

  this.physics.world.setBounds(screenWidth, 0, worldWidth, screenHeight)

  applyPlayerInvulnerability.call(this, 4000)

  player.isBlocked = true

  const marioAnimations = MARIO_ANIMATIONS[player.state]
  player.setVelocityX(5)
  // player.anims.play('run', true).flipX = false
  player.anims.play(marioAnimations.walk, true).flipX = false

  this.cameras.main.fadeOut(900, 0, 0, 0)
  this.hereWeGoSound.play()

  setTimeout(() => {
    if (!playerOptions.isLevelOverworld) {
      player.y = screenHeight / 5
      this.musicTheme.stop()
      this.undergroundMusicTheme.play({ loop: -1 })
    } else {
      this.musicTheme.play({ loop: -1 })
    }

    player.x = screenWidth * 1.1
    this.cameras.main.pan(screenWidth * 1.5, 0, 0)
    player.isBlocked = false
    this.cameras.main.fadeIn(500, 0, 0, 0)
    // createHUD.call(this);
    // updateTimer.call(this);
    this.startScreenTrigger.destroy()
    this.levelStarted = true
    // if (this.settingsMenuOpen)hideSettings.call(this);
  }, 1100)
}

// function revealHiddenBlock () { console.log('revealHiddenBlock') }
// function destroyBlock () { console.log('destroyBlock') }
function collectCoin () { console.log('collectCoin') }
function teleportToLevelEnd () { console.log('teleportToLevelEnd') }
