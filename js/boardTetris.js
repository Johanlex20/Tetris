import { Grid } from "./grid.js";

export class BoardTetris extends Grid{
    constructor(canvas, rows, cols, cellSize, space){
        super(canvas, rows, cols, cellSize, space);
    }


    /**SEGUNDA PARTE: */

    isInside(row, col){
        return row>=0 && row < this.rows && col >= 0 && col < this.cols;
    }

    isEmpty(row, col){
        return this.isInside(row, col) && this.matriz[row][col] === 0;
    }

    isRowFull(row){
        return this.matriz[row].every(element => element !== 0);
    }

    isRowEmpty(row){
        return this.matriz[row].every(element => element === 0);
    }

    clearRow(row){
        return this.matriz[row].fill(0);
    }

    moveRowDown(row, numRows){
        this.matriz[row + numRows] = this.matriz[row].slice();
        this.clearRow(row);
    }

    clearFullRows(){
        let cont = 0;
        for(let r = this.rows - 1; r >= 0; r--){
            if(this.isRowFull(r)){
                this.clearRow(r);
                cont++;
            } else if(cont > 0){
                this.moveRowDown(r, cont);
            }
        }
        return cont;
    }

    gameOver(){
        return !(this.isRowEmpty(0));
    }
 









}