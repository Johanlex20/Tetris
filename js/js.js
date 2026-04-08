import { BoardTetris } from "./boardTetris.js";
import {Tetromino,Position,TetrominoType} from "./tetromino.js";


// Conecta el tablero canvas del HTML con el codigo JS, y establece las filas, columnas, tamaño de celda y espacio entre celdas para el tablero de Tetris
// Es la pantalla de juego
const canvasTetris = document.getElementById("canvas-tetris");
const rows = 20;
const cols = 10;
const cellSize = 26;
const space = 2;

/**
 * 
 * CREAR TABLERO
 * 
 * Cunado se crea una instancia de BoardTetris, se llama al constructor de Grid, que a su vez llama al metodo restartMatriz, que llena la matriz con 0, indicando que todas las celdas estan vacias. Luego se establece el tamaño del canvas en base a las filas, columnas, tamaño de celda y espacio entre celdas.
 * 
        1. Se ejecuta Grid()
        2. Se crea matriz
        3. Se configura canvas
        4. Se guarda contexto
 * 
 */
const boardTetris = new BoardTetris(canvasTetris, rows, cols, cellSize, space);


/**
 * CREAR LA PIEZA
 */
const tetrominoType = TetrominoType.T; //"dame la configuración de la pieza T"
const tetromino = new Tetromino(  //Estás creando una pieza REAL del juego
    canvasTetris,  //Dónde se va a dibujar la pieza
    cellSize, //Qué tan grande es cada bloque
    tetrominoType.shapes, //La forma de la pieza
    tetrominoType.initPosition, //posición inicial
    tetrominoType.id //color o id de la pieza
    );

/*

1. Se crea una pieza
2. Tiene forma (shapes)
3. Tiene posición inicial
4. Tiene color (id)

*/


//EL GAME LOOP (LO MÁS IMPORTANTE)
function update(){
    boardTetris.draw();
    tetromino.draw(boardTetris);  
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


    COMO SE CONECTA TODO 

    js.js (main)
    ↓
    crea BoardTetris (Grid)
    ↓
    crea Tetromino
    ↓
    update()
    ↓
    Grid.draw()
    ↓
    dibuja tablero vacío
    ↓
    Tetromino.draw(grid)
    ↓
    calcula posiciones
    ↓
    drawBlock()
    ↓
    canvas dibuja pieza
    ↓
    requestAnimationFrame
    ↓
    repite TODO

*/