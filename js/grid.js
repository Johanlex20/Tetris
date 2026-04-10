//  IDEA PRINCIPAL

import { Tetromino } from "./tetromino.js";

// El Grid hace 3 cosas:

// Guarda el estado del tablero (matriz)
// Sabe convertir filas/columnas → pixeles
// Sabe dibujar el tablero

export class Grid {
    
    constructor(canvas, rows, cols, cellSize, space){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize; //Tamaño de cada bloque cada celda mide 26px + 2px espacio
        this.space = space; // Espacio entre bloques  cada celda mide 26px + 2px espacio
        this.matriz = []; // El tablero en Matriz donde iran a caer las piezas
        this.restartMatriz();

        this.canvas.width = this.cols * this.cellSize + (this.space * this.cols);
        this.canvas.height = this.rows * this.cellSize + (this.space * this.rows);


        /**SEGUNDA PARTE */
        this.block = new Tetromino(this.canvas, this.cellSize); //Es como un “pincel” para dibujar bloques

    }

    restartMatriz(){
        for(let r = 0; r < this.rows; r++){ // recorre las filas
            this.matriz[r] = [];  // 
            for(let c = 0; c < this.cols; c++){
                this.matriz[r][c] = 0; // llena cada celda con un 0, indicando que esta vacia y colore segun el color indicado
            }
        }
    }

    /* Resultado Grafico del restarMatriz
    
            matriz = [
        [0,0,0,0,0,0,0,0,0,0], ← fila 0
        [0,0,0,0,0,0,0,0,0,0], ← fila 1
        ...
        ]
    
    */


    //Dibuja un cuadrado o bloque con borde, para el tablero y las piezas
    drawSquere(x,y,side,color,borderColor){
        const borderSize = side / 10; //Calula el grosor del borde

        //Dibujo del bloque con borde Solido
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y,side,side);
        
        //Dibuja el borde del bloque
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderSize;
        this.ctx.strokeRect(x+borderSize/2, y+borderSize/2, side - borderSize, side- borderSize);
    }

    // Metodo para convertir filas y columnas a pixeles Ej: cellSize = 26, space = 2  igual 1 celda mide 28px
    /*
    EJ
    getCoordinates(3, 2)

    x = 3 * 28 = 84
    y = 2 * 28 = 56

    columna 3 → pixel 84
    fila 2 → pixel 56

    ---84
    --56-

    */
     getCoordinates(col,row){
        return{ x: col * (this.cellSize + this.space), y: row * (this.cellSize + this.space)};
     }


    // Metodo para dibujar el tablero 
     draw(){
        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                const postion = this.getCoordinates(c,r); // Convierte celda → pixeles
                this.drawSquere(postion.x, postion.y, this.cellSize, "#000", "#272626");

                /**SEGUNDA PARTE */
                if(this.matriz[r][c] !== 0){ // Si la celda no esta vacia (0) dibuja un bloque con el color especificado en la matriz
                    this.block.drawBlock(postion.x, postion.y, this.matriz[r][c]);
                }else{
                    this.drawSquere(postion.x, postion.y, this.cellSize, "#000", "#303030");
                }


            }
        } 
        this.printMatriz();
    }   

    /*
        Recore en una doble iteracion
        (0,0) (0,1) (0,2) ... (0,9)
        (1,0) (1,1) (1,2) ... (1,9)
        ...

        getCoordinates(0,0) convierte cada celda en pixel 

        drawSquere dibuja un bloque en la posicion dada por getCoordinates con el color y borde especificado

        RESULTADO GRAFICO DEL DRAW
         _ _ _ _ _
        | | | | | |
         _ _ _ _ _
        | | | | | |
         _ _ _ _ _
        | | | | | |
    
    */

    // Metodo para Imprimir la matriz en la consola
    printMatriz(){
        let text = "";
        this.matriz.forEach(row => {
            text += row.join(" ") + "\n"; // convierte esto [0,0,0,0] a "0 0 0 0" y agrega un salto de linea al final de cada fila
        });
        console.log(text);
    }

    /* Resumen hasta Aqui del Grid 
    
    1. Crea una matriz (estado lógico)
    2. Recorre esa matriz
    3. Convierte posiciones a pixeles
    4. Dibuja cada celda
    

     ¿Cómo se conecta con lo demás?

        Más adelante:

        Tetromino usa → getCoordinates()
        Board usa → draw()
        Juego usa → todo

    */


}
