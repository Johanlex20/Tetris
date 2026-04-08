import {Game} from "./game.js";


// Conecta el tablero canvas del HTML con el codigo JS, y establece las filas, columnas, tamaño de celda y espacio entre celdas para el tablero de Tetris
// Es la pantalla de juego
const canvasTetris = document.getElementById("canvas-tetris");
const rows = 20;
const cols = 10;
const cellSize = 26;
const space = 2;



const game = new Game(canvasTetris, rows, cols, cellSize, space);

//EL GAME LOOP (LO MÁS IMPORTANTE)
function update(){
    game.update();
    requestAnimationFrame(update); //Le dice al navegador: "vuelve a ejecutar update en el siguiente frame"
}

update();

/*
    update()
    ↓
    dibuja tablero
    ↓
    dibuja pieza
    ↓
    se llama otra vez
    ↓
    update()
    ↓
    (repite para siempre)

*/