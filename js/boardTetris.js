import { Grid } from "./grid.js";

export class BoardTetris extends Grid{
    constructor(canvas, rows, cols, cellSize, space){
        super(canvas, rows, cols, cellSize, space);
    }

    /**
     * 👉 Este archivo responde preguntas como:

        ¿esto está dentro del tablero?
        ¿esta celda está ocupada?
        ¿la fila está llena?
        ¿hay que borrar filas?
     */

    /**SEGUNDA PARTE: */

    //Evita salir del tablero
    /**
     * 
     * Supón tablero 5x5:

        col →
            0 1 2 3 4
        row
        0   . . . . .
        1   . . . . .
        2   . . . . .
        3   . . . . .
        4   . . . . .
     */

    isInside(row, col){
        return row>=0 && row < this.rows && col >= 0 && col < this.cols; //Verifica si estás dentro del tablero
    }

    isEmpty(row, col){
        return this.isInside(row, col) && this.matriz[row][col] === 0; //“Está dentro Y está vacío”
    }

    /**
        [0 0 0]
        [0 2 0]
        [0 0 0]
        CASO
        (1,1) → hay 2 → ❌ no vacío
        (0,1) → hay 0 → ✅ vacío
     */

    isRowFull(row){//Esto se usa para detectar colisiones
        return this.matriz[row].every(element => element !== 0);
    }

    /**
     * “¿TODOS los elementos son distintos de 0?”

        🎮 VISUAL
        [1 2 3 4 5] ✅ llena
        [1 0 3 4 5] ❌ no llena
     */

    isRowEmpty(row){
        return this.matriz[row].every(element => element === 0);
    }

    /**
     *  [0 0 0 0] ✅ vacía
        [0 0 2 0] ❌ no vacía
     */

    clearRow(row){
        return this.matriz[row].fill(0);
    }

    /*
        🎮 ANTES
        [2 2 2 2]
        DESPUÉS
        [0 0 0 0]

        👉 Borra la fila
    */


    //Baja una fila hacia abajo
    moveRowDown(row, numRows){
        this.matriz[row + numRows] = this.matriz[row].slice();
        this.clearRow(row);
    }

    /**
     * 
     * 👉 Baja una fila hacia abajo

        🎮 EJEMPLO
        ANTES:

        fila 4: [0 2 0 2]
        fila 5: [1 1 1 1] ← llena

        Después de borrar fila 5:

        fila 5: [0 0 0 0]

        Ahora:

        moveRowDown(4, 1)
        RESULTADO
        fila 5: [0 2 0 2]
        fila 4: [0 0 0 0]

        👉 TODO baja
     */

    clearFullRows(){
        let cont = 0;
        for(let r = this.rows - 1; r >= 0; r--){
            if(this.isRowFull(r)){ //Qué revisa:¿toda la fila tiene números ≠ 0? EJ: [1 2 3 4 5 6 7 1 2 3] → llena
                this.clearRow(r); //si esta llena borra la fila EJ: [0 0 0 0 0 0 0 0 0 0]
                cont++;
            } else if(cont > 0){ // Si la fila esta sola baja todo
                this.moveRowDown(r, cont);
            }
        }
        return cont;

        /**
         * ANTES:

            fila 5: [1 1 1 1] ← llena
            fila 4: [0 2 0 2]

            DESPUÉS:

            fila 5: [0 2 0 2]
            fila 4: [0 0 0 0]
         */
    }

    gameOver(){
        return !(this.isRowEmpty(0)); //“Si la fila 0 NO está vacía → perdiste”
    }

    /**
     * isInside     → límites
        isEmpty      → colisiones
        isRowFull    → detectar líneas
        clearRow     → borrar
        moveRowDown  → gravedad
        clearFullRows→ lógica completa de Tetris
        gameOver     → fin del juego

        Game.placeTetromino()
                ↓
        matriz se llena
                ↓
        clearFullRows()
                ↓
        tablero se reorganiza
                ↓
        draw()
                ↓
        lo ves en pantalla
     */
 









}