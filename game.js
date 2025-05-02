/* global Phaser */
/**
 * Phaser es una librería de JavaScript para crear juegos en 2D.
 * Al importar el archivo Phaser.js, se puede utilizar la clase Phaser.Game para crear un nuevo juego.
 * 
 */
const config = {
  type: Phaser.AUTO, // Tipo de renderizado (WebGL o Canvas) especificado automáticamente por Phaser.
  width: 256,
  height: 244,
  backgroundColor: "#fff",
  parent: "game", // ID del elemento HTML donde se renderizará el juego.
  scene: {
    preload, // Método para cargar recursos antes de iniciar el juego.
    create, // Método para crear los elementos del juego. (se ejecuta una vez al inicio).
    update // Método que se ejecuta en cada frame del juego.
  }
}

new Phaser.Game(config) // Crear una nueva instancia del juego con la configuración especificada.

function preload() { // 1.
  console.log("preload")
}

function create() { // 2.
  console.log("create")
}

function update() {}