
/**
 *  IDEA PRINCIPAL

Este archivo hace 3 cosas:

Define qué es una posición (Position)
Define qué es una pieza (Tetromino)
Define los tipos de piezas (TetrominoType)
 */

class Position{  //Representa una coordenada de una pieza en el tablero (0,0)
    constructor(row, column){
        this.row = row;
        this.column = column;
    }
}

/**
 *  Ejemplo
new Position(2,1)

Significa:

fila 2 columna 1

Visual
(0,0) (0,1) (0,2)
(1,0) (1,1) (1,2)
(2,0) (2,1) (2,2)

Position(2,1) sería aquí:

(2,1) → X
 */

class Tetromino{
    constructor(canvas, cellSize, shapes = [], initPosition = new  Position() , id=1){ /**SEGUNDA PARTE INICIALIZAR VARIABLES YA QUE SE ESTAN LLAMANDO EN EL GRID */

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.cellSize = cellSize;
        this.shapes = shapes; // Aquí vive la forma de la pieza
        this.rotation = 0; //Indica qué rotación estás usando
        this.initposition = initPosition; //dónde aparece la pieza al inicio
        this.position = new Position(initPosition.row, initPosition.column); //Esto define dónde está la pieza completa
        this.id = id; // tipo de pieza
    }

    /*
        new Position(1,2)
        VISUAL COMPLETO

        Pieza base en (5,3)

            Bloques internos:

                (0,1)
            (1,0)(1,1)(1,2)

            Resultado en el tablero:
                (5,4)
            (6,3)(6,4)(6,5)
            
            Position = una coordenada en una grilla

            row → vertical (abajo)
            column → horizontal (derecha)

            La pieza usa su posición base + las posiciones internas para calcular dónde va cada bloque

            Ahora te lo refuerzo visualmente

            Base de la pieza:

            (2,2)

            Shape:

            (0,1)
            (1,1)
            Resultado en el tablero:
                columnas →
                    0    1    2    3

            filas ↓
            0    .    .    .    .
            1    .    .    .    .
            2    .    .    B    X   ← (2,3)
            3    .    .    B    X   ← (3,3)

            👉 B = base (2,2)
            👉 X = bloques dibujados
    
            */
    


    //Solo sirven para dibujar un bloque bonito en el canvas
    drawSquare(x, y, side, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, side, side); //DICE Dibuja un rectángulo (en este caso cuadrado)
    }

    //Dibuja un triángulo usando 3 puntos
    drawTriangle(x1,y1,x2,y2,x3,y3,color){
        this.ctx.beginPath();   //Empieza un dibujo nuevo
        this.ctx.moveTo(x1, y1);  // Va al primer punto
        this.ctx.lineTo(x2, y2);  // Dibuja líneas hacia los otros puntos
        this.ctx.lineTo(x3, y3);  // Dibuja líneas hacia los otros puntos
        this.ctx.closePath();  // Cierra el triángulo
        this.ctx.fillStyle = color;  // Lo rellena
        this.ctx.fill();  //Lo rellena
    }


    /**
     * Ejemplo de uso de drawTriangle
            (x1,y1)
               ●
              / \
             /   \
            ●-----●
            (x2,y2) (x3,y3)
     */

    getColorPalette(id){
        const palette ={
            1:{
                rightTriangle: "#FE8601",
                leftTriangle: "#ffffff",
                square:"#FFDB01"
            },
            2:{
                rightTriangle: "#FE5E02",
                leftTriangle: "#ffffff",
                square:"#FE8602"
            },
            3:{
                rightTriangle: "#B5193B",
                leftTriangle: "#ffffff",
                square:"#EE1B2E"
            },
            4:{
                rightTriangle: "#22974C",
                leftTriangle: "#ffffff",
                square:"#24DC4F"
            },
            5:{
                rightTriangle: "#49BDFF",
                leftTriangle: "#ffffff",
                square:"#2D97F7"
            },
            6:{
                rightTriangle: "#0000C9",
                leftTriangle: "#ffffff",
                square:"#0101F0"
            },
            7:{
                rightTriangle: "#8500D3",
                leftTriangle: "#ffffff",
                square:"#A000F1"
            }
        }
        return palette[id] || palette[1]; 
    }

    /*
        🔷 6. drawBlock()

        Dibuja un bloque visual bonito

        🧠 Qué hace
        Calcula margen
        Obtiene colores
        Dibuja:
        triángulos
        cuadrado central
    */
    

    //Esta función dibuja UN bloque completo estilo Tetris moderno    
    drawBlock(x,y,id){
        const margin = this.cellSize / 8; //Esto crea un espacio interno
        const palette = this.getColorPalette(id);

        /* margen = borde interno
        ┌──────────┐
        │  ██████  │
        │  ██████  │
        └──────────┘
        */

        //Dibujar Triangulo Izquierdo
        this.drawTriangle(
            x,y,
            x + this.cellSize, y,
            x,y + this.cellSize,
            palette.rightTriangle
        );

        //Dibujar Triangulo Derecho
        this.drawTriangle(
            x + this.cellSize, y,
            x + this.cellSize, y + this.cellSize,
            x, y + this.cellSize,
            palette.rightTriangle
        );

        //Dibujar Cuadrado Central
        this.drawSquare(
            x + margin, 
            y + margin, 
            this.cellSize - (margin*2), 
            palette.square
        );

    }

    currentShape(){
        return this.shapes[this.rotation];//Retorna la forma actual del tetromino dependiendo de su rotacion
    }

    /* 
    Ej
    rotation = 0 → forma normal
    rotation = 1 → rotada
    */


    //ESTO ES LO MÁS IMPORTANTE Dibuja la pieza en el tablero usando su posición base + las posiciones internas de su forma para calcular dónde va cada bloque
    draw(grid){
        const shape = this.currentShape();  // Obtiene la forma actual
        for(let i = 0; i < shape.length; i++){  //Recorre cada bloque de la pieza o forma
            //Esta parte es clave
            const position = grid.getCoordinates(
            this.position.column + shape[i].column, 
            this.position.row + shape[i].row
        );

        this.drawBlock(position.x, position.y, this.id);  //Dibuja el bloque

        }
    }


    /*
    CURRENT POSITION
    Devuelve TODAS las posiciones reales de la pieza
        EJ
            [
            (5,3),
            (5,4),
            (6,3),
            (6,4)
            ]

    */
    currentPosition(){ 
        const position = [];
        const shape = this.currentShape();
        for(let i = 0; i < shape.length; i++){
            position.push(new Position(
                this.position.row + shape[i].row,
                this.position.column + shape[i].column
            ));
        }
        return position;
    }

    move(row, column){
        this.position.row += row;
        this.position.column += column;
    }

    reset(){
        this.position = 0;
        this.position = new Position(this.initposition.row, this.initposition.column);
    }
}

const TetrominoType = {
    T:{
        id:1,
        initPosition: new Position(0,3),
        shapes:[
            [new Position(0,1), new Position(1,0), new Position(1,1), new Position(1,2)],
            [new Position(0,1), new Position(1,1), new Position(1,2), new Position(2,1)],
            [new Position(1,0), new Position(1,1), new Position(1,2), new Position(2,1)],
            [new Position(0,1), new Position(1,0), new Position(1,1), new Position(2,1)]
        ]

    },
    O:{
        id:2,
        initPosition: new Position(0,4),
        shapes:[
            [new Position(0,0), new Position(0,1), new Position(1,0), new Position(1,1)]
        ]
    },
    I:{
        id:3,
        initPosition: new Position(-1,3),
        shapes:[        
           [new Position(1,0), new Position(1,1), new Position(1,2), new Position(1,3)],
           [new Position(0,2), new Position(1,2), new Position(2,2), new Position(3,2)],
           [new Position(2,0), new Position(2,1), new Position(2,2), new Position(2,3)],
           [new Position(0,1), new Position(1,1), new Position(2,1), new Position(3,1)]
        ]
    },
    S:{
        id:4,
        initPosition: new Position(0,3),
        shapes:[
            [new Position(0,1), new Position(0,2), new Position(1,0), new Position(1,1)],
            [new Position(0,1), new Position(1,1), new Position(1,2), new Position(2,2)],
            [new Position(1,1), new Position(1,2), new Position(2,0), new Position(2,1)],  
            [new Position(0,0), new Position(1,0), new Position(1,1), new Position(2,1)]
        ] 
    },
    Z:{
        id:5,
        initPosition: new Position(0,3),
        shapes:[
            [new Position(0,0), new Position(0,1), new Position(1,1), new Position(1,2)],
            [new Position(0,2), new Position(1,1), new Position(1,2), new Position(2,1)],
            [new Position(1,0), new Position(1,1), new Position(2,1), new Position(2,2)],
            [new Position(0,1), new Position(1,0), new Position(1,1), new Position(2,0)]
        ]
    },
    J:{
        id:6,
        initPosition: new Position(0,3),
        shapes:[
            [new Position(0,0), new Position(1,0), new Position(1,1), new Position(1,2)],
            [new Position(0,1), new Position(0,2), new Position(1,1), new Position(2,1)],   
            [new Position(1,0), new Position(1,1), new Position(1,2), new Position(2,2)],
            [new Position(0,1), new Position(1,1), new Position(2,0), new Position(2,1)]
        ]
    },
    L:{
        id:7,
        initPosition: new Position(0,3),
        shapes:[
            [new Position(0,2), new Position(1,0), new Position(1,1), new Position(1,2)],
            [new Position(0,1), new Position(1,1), new Position(2,1), new Position(2,2)],
            [new Position(1,0), new Position(1,1), new Position(1,2), new Position(2,0)],
            [new Position(0,0), new Position(0,1), new Position(1,1), new Position(2,1)]
        ]
    }
}


/**SEGUNDA PARTE CREAR UNA BOLSA DE FORMAS QUE SE LLENAN Y VAN SALIENDO ALEATOREAMENTE LA QUE SALE VA SALIENDO DE LA LISTA HASTA QUE TODAS HAYAN SALIDO, ESTO AHI QUE TRABAJARLO DESPUES */

class TetrominoBag{
    constructor(canvas, cellSize){
        this.canvas = canvas;
        this.cellSize = cellSize;
        this.bag = [];
    }

    fillBag(){
        const tetrominoTypes = [
            TetrominoType.T,
            TetrominoType.O,
            TetrominoType.I,
            TetrominoType.S,
            TetrominoType.Z,
            TetrominoType.J,
            TetrominoType.L
        ]
        this.bag.length = 0; // Limpia la bolsa
        tetrominoTypes.forEach(type => {
            this.bag.push(new Tetromino(this.canvas, this.cellSize, type.shapes, type.initPosition, type.id));
        });

        for(let i = this.bag.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        } 
    }

    getNextTetromino(){
        if(this.bag.length === 0){
            this.fillBag();
        } 
        return this.bag.pop();
    }

}

export { Position, Tetromino, TetrominoType, TetrominoBag };


/**
 * 
 *      CONEXION FINAL 
 * 
        Tetromino.draw()
         ↓
        drawBlock()
        ↓
        drawTriangle + drawSquare
        ↓
        canvas pinta el bloque

        

        🧠 IDEA CLAVE FINAL

        👉 Todo este código NO mueve piezas
        👉 NO calcula posiciones
        👉 NO usa la matriz

        👉 SOLO dibuja
 */


