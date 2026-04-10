import { BoardTetris } from "./boardTetris.js";
import { TetrominoBag } from "./tetromino.js";

export class Game{
    constructor(canvas, rows, cols, cellSize, space){
        this.boardTetris = new BoardTetris(canvas, rows, cols, cellSize, space); //Crea el tablero (matriz + dibujo)
        this.tetrominosBag = new TetrominoBag(canvas, cellSize);  // Crea la "bolsa" de piezas aleatorias
        this.currentTetromino = this.tetrominosBag.getNextTetromino(); //Saca la primera pieza
        this.keyboard();
        this.keys = {up:false, down:false}; // si asido presionado Estado del teclado

        this.lastTime = 0; // teimpos de caida
        this.lastTime2 =0; //

    }

    update(){

        let curretTime = Date.now();  //Tiempo actual
        let deltaTime = curretTime - this.lastTime; //Cuánto tiempo ha pasado
        let deltaTime2 = curretTime - this.lastTime2;

        //CAÍDA AUTOMÁTICA GRAVEDAD DE CAIDA
        if(deltaTime >=1000){
            this.autoMoveTetrominoDown();
            this.lastTime = curretTime;
        }
        //DIBUJO (rápido)
        /**
         * 1. Se dibuja el grid
           2. Se dibuja la pieza encima 
           CONTROLA LA VELOCIDAD DE DIBUJO PARA QUE NO SE VEA UN BUG
         */
        if(deltaTime2 >= 50){ 
            this.boardTetris.draw();
            this.currentTetromino.draw(this.boardTetris);

            if(this.keys.down){//eSTO ROMPE LA REGLA DE TIEMPO 
                this.moveTetrominoDown(); //Si mantienes ↓ baja más rápido
            }

            this.lastTime2 = curretTime;
        }

        // this.boardTetris.draw();
        // this.currentTetromino.draw(this.boardTetris);
    }

    //COLISIONES
    blockedTetromino(){
        const tetrominoPositions = this.currentTetromino.currentPosition();  //Obtiene todas las posiciones reales:
        for(let i = 0; i<tetrominoPositions.length; i++){ //vaerifica que las piezas no ocupen celdas llenas
            if(!this.boardTetris.isEmpty(tetrominoPositions[i].row, tetrominoPositions[i].column)){ //si NO está vacío → chocó
                return true;
            }
        }
        return false;

        /**
         * Supón matriz:
            fila 7:
            [0 0 2 2 0 0]
            Pieza quiere ocupar:
            (7,3)
            Entonces:
            this.matriz[7][3] === 2
            NO está vacío

            Resultado:
            isEmpty → false
            !isEmpty → true

            👉 💥 COLISIÓN
            En cuanto UN bloque choca → toda la pieza choca
         */
    }

    autoMoveTetrominoDown(){
        this.currentTetromino.move(1,0); //Baja 1 fila
        if(this.blockedTetromino()){ //choca una pieza
            this.currentTetromino.move(-1,0); // vuelve arriba
            this.placeTetromino(); // la fija 
        }
    }

    /*
        if(this.blockedTetromino()){

            👉 Si chocó…

            this.currentTetromino.move(-1,0);

            👉 DESHACE el movimiento

            ANTES:
            fila 6 → pieza
            fila 7 → bloque

            INTENTA BAJAR:
            fila 7 → 💥 choca

            SE DEVUELVE:
            fila 6 → pieza
    */

    moveTetrominoLeft(){ //mueve izquierda
        this.currentTetromino.move(0,-1);
        //1. intenta moverse
        //2. si choca → deshacer
        if(this.blockedTetromino()){
            this.currentTetromino.move(0,1); 
        }
    }

    moveTetrominoRight(){
        this.currentTetromino.move(0,1);
        if(this.blockedTetromino()){
            this.currentTetromino.move(0,-1);
        }
    }

    moveTetrominoDown(){
        this.currentTetromino.move(1,0);
        if(this.blockedTetromino()){
            this.currentTetromino.move(-1,0);
        }
    }

    //ROTACIÓN hacia derecha de cuatro tiempos si el largo de las formas en mayor a 123 osea 4 reincia la forma a 0
    rotationTetrominoCW(){ //cambia forma
        this.currentTetromino.rotation++;
        if(this.currentTetromino.rotation > this.currentTetromino.shapes.length-1){
            this.currentTetromino.rotation = 0;
        }
        if(this.blockedTetromino()){//si choca → deshacer rotación
            this.rotationTetrominoCCW();//rotacion izquierda
        }
    }
    //Rotacion izquierda
    rotationTetrominoCCW(){
        this.currentTetromino.rotation--;
        if(this.currentTetromino.rotation<0){
            this.currentTetromino.rotation = this.currentTetromino.shapes.length -1
        }
        if(this.blockedTetromino()){
            this.rotationTetrominoCW();
        }
    }

    //La pieza deja de ser "temporal" y pasa a la matriz.

    /**
     * 
     * @returns 👉 Aquí la pieza pasa de:

        "objeto temporal"
        a:

        "parte del tablero"
        📊 ANTES
        matriz:
        [0 0 0 0]
        [0 0 0 0]

        pieza flotando encima
        📊 DESPUÉS
        matriz:
        [0 0 2 2]
        [0 0 2 2]

        👉 ya está guardada
     */
    placeTetromino(){
        const tetrominoPositions = this.currentTetromino.currentPosition(); //OBTENER POSICIONES REALES

        /**
         * 📊 ¿Qué devuelve esto?

            Un array de posiciones:

            [
            {row: 5, column: 3},
            {row: 5, column: 4},
            {row: 6, column: 3},
            {row: 6, column: 4}
            ]
            🎮 VISUAL
            fila↓

            6   .  X  X
            5   .  X  X
                3  4 → columna
         */
        for(let i = 0; i < tetrominoPositions.length; i++){ //RECORRER CADA BLOQUE
            this.boardTetris.matriz
                [tetrominoPositions[i].row]
                [tetrominoPositions[i].column] = this.currentTetromino.id; //GUARDAR EN LA MATRIZ
        }

        this.boardTetris.clearFullRows();  //limpiar filas  y bajo todo

        /**
         * 🎮 ¿Qué significa?

            👉 revisa la fila 0 (arriba)

            Si NO está vacía:

            fila 0: [0 0 3 0 0] ❌

            👉 💀 PERDIST
         */
        if(this.boardTetris.gameOver()){
            return true;
        }else{
            this.currentTetromino = this.tetrominosBag.getNextTetromino(); //sino se genera una nueva piezaa NUEVA PIEZA
        }
    }


    keyboard(){
        window.addEventListener("keydown", (evt) =>{
            if(evt.key === "ArrowLeft"){
                this.moveTetrominoLeft();
            }
            if(evt.key === "ArrowRight"){
                this.moveTetrominoRight();
            }
            if(evt.key === "ArrowUp" && !this.keys.up){
                this.rotationTetrominoCW();
                this.keys.up = true;
            }
             if(evt.key === "ArrowDown"){ 
                this.keys.down = true;
            }
        });

        window.addEventListener("keyup", (evt) =>{
            if(evt.key === "ArrowUp"){
                this.keys.up = false;
            }
             if(evt.key === "ArrowDown"){ 
                this.keys.down = false;
            }
        });
    }
}