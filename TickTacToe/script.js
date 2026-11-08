const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const SIMULATION_SIZE = 4;
const CHANGE_RATE = 0.05;

class TickTacToe{
    static borderColor = "#000";
    static circleColor = "#0000ff";
    static crossColor = "#ff0000";
    static borderSize = 10;

    static defaultSize = 300;
    static defaultBoard = [[0,0,0],[0,0,0],[0,0,0]];
    static defaultPos = [0,0];

    constructor(board = TickTacToe.defaultBoard.map(row => [...row]),size = TickTacToe.defaultSize,pos = TickTacToe.defaultPos){
        this.board = board;
        this.size = size;
        this.pos = pos;
    }

    takeSpot(row, col, side){
        if(this.validSpot(row, col)){
            this.board[row][col] = side;
        }
    }

    validSpot(row, col){
        return this.board[row][col] === 0;
    }

    clear(){
        for(let row = 0; row < this.board.length; row++){
            for(let col = 0; col < this.board[row].length; col++){
                this.board[row][col] = 0;
            }
        }
    }

    expandBoard(side){
        let newBoard = []
        for(let row = 0; row < this.board.length; row++){
            for(let col = 0; col < this.board[row].length; col++){
                newBoard.push(this.board[row][col] * side);
            }
        }
        return newBoard;
    }

    checkWinner(){
        let horizontals = this.checkHorizontals();
        if(horizontals === -1 || horizontals === 1){
            return horizontals;
        }

        let verticles = this.checkVerticles();
        if(verticles === -1 || verticles === 1){
            return verticles;
        }

        let diagonals = this.checkDiagonals();
        if(diagonals === -1 || diagonals === 1){
            return diagonals;
        }

        return 0;
    }

    isDraw(){
        for(let row = 0; row < this.board.length; row++){
            for(let col = 0; col < this.board[row].length; col++){
                if(this.board[row][col] === 0){
                    return false;
                }
            }
        }
        return true;
    }

    checkHorizontals(){
        for(let row = 0; row < this.board.length; row++){
            let firstSpot = this.board[row][0];
            let hasWon = true;
            for(let col = 1; col < this.board[row].length; col++){
                if(this.board[row][col] !== firstSpot){
                    hasWon = false;
                    break;
                }
            }
            if(hasWon){
                return firstSpot;
            }
        }
        return 0;
    }

    checkVerticles(){
        for(let col = 0; col < this.board[0].length; col++){
            let firstSpot = this.board[0][col];
            let hasWon = true;
            for(let row = 1; row < this.board.length; row++){
                if(this.board[row][col] !== firstSpot){
                    hasWon = false;
                    break;
                }
            }
            if(hasWon){
                return firstSpot;
            }
        }
        return 0;
    }

    checkDiagonals(){
        let firstSpot = this.board[0][0];
        let hasWon = true;
        for(let i = 1; i < this.board.length; i++){
            if(this.board[i][i] !== firstSpot){
                hasWon = false;
                break;
            }
        }
        if(hasWon){
            return firstSpot;
        }

        firstSpot = this.board[0][this.board[0].length-1];
        hasWon = true;
        for(let i = 1; i < this.board.length; i++){
            if(this.board[i][this.board[i].length - (i+1)] !== firstSpot){
                hasWon = false;
                break;
            }
        }
        if(hasWon){
            return firstSpot;
        }
        return 0;
    }

    draw(){
        const cellSize = this.size / 3;
        const [x, y] = this.pos;

        // Clear the drawing area
        ctx.clearRect(x, y, this.size, this.size);

        // Draw the board grid
        ctx.strokeStyle = TickTacToe.borderColor;
        ctx.lineWidth = TickTacToe.borderSize;

        ctx.beginPath();

        // Vertical lines
        for(let i = 1; i < 3; i++){
            ctx.moveTo(x + i * cellSize, y);
            ctx.lineTo(x + i * cellSize, y + this.size);
        }

        // Horizontal lines
        for(let i = 1; i < 3; i++){
            ctx.moveTo(x, y + i * cellSize);
            ctx.lineTo(x + this.size, y + i * cellSize);
        }

        ctx.stroke();

        // Draw X's and O's
        for(let row = 0; row < 3; row++){
            for(let col = 0; col < 3; col++){
                const value = this.board[row][col];

                if(value === 0) continue;

                const centerX = x + col * cellSize + cellSize / 2;
                const centerY = y + row * cellSize + cellSize / 2;
                const padding = cellSize * 0.2;

                ctx.lineWidth = 6;
                ctx.lineCap = "round";

                if(value === -1){
                    // Draw circle
                    ctx.strokeStyle = TickTacToe.circleColor;
                    ctx.beginPath();
                    ctx.arc(
                        centerX,
                        centerY,
                        cellSize * 0.3,
                        0,
                        Math.PI * 2
                    );
                    ctx.stroke();
                }
                else if(value === 1){
                    // Draw cross
                    ctx.strokeStyle = TickTacToe.crossColor;
                    ctx.beginPath();

                    ctx.moveTo(centerX - padding, centerY - padding);
                    ctx.lineTo(centerX + padding, centerY + padding);

                    ctx.moveTo(centerX + padding, centerY - padding);
                    ctx.lineTo(centerX - padding, centerY + padding);

                    ctx.stroke();
                }
            }
        }
    }
}

class Layer{
    static weightRange = [-1,1];
    static baisRange = [-1,1];

    constructor(numNodesIn, numNodesOut, layer=null){
        this.numNodesIn = numNodesIn;
        this.numNodesOut = numNodesOut;

        this.weights = Array.from({ length: numNodesIn }, () => Array(numNodesOut).fill(0))
        this.biases = new Array(numNodesOut).fill(0);

        if (layer === null){
            this.generateWeightsAndbiases();
        } else {
            this.setweightsAndbiases(layer.weights,layer.biases);
        }
    }

    generateWeightsAndbiases(){
        for(let row = 0; row < this.numNodesIn; row++){
            for(let col = 0; col < this.numNodesOut; col++){
                this.weights[row][col] = getRandomDouble(Layer.weightRange[0],Layer.weightRange[1]);
            }
        }

        for(let i = 0; i < this.biases.length; i++){
            this.biases[i] = getRandomDouble(Layer.baisRange[0],Layer.baisRange[1]);
        }
    }

    setweightsAndbiases(weights, biases){
        this.weights = weights.map(row => [...row]);

        this.biases = [...biases]; 
    }

    calculateNodeOutput(inputValues,outputNodeNum){
        let weightedSum = 0;
        for(let inputNodeNum = 0; inputNodeNum < this.numNodesIn; inputNodeNum++){
            weightedSum += inputValues[inputNodeNum] * this.weights[inputNodeNum][outputNodeNum];
        }
        weightedSum += this.biases[outputNodeNum];
        return this.sigmoid(weightedSum);
    }

    calculateRowOutput(inputValues){
        let outputs = [];
        for(let outputNodeNum = 0; outputNodeNum < this.numNodesOut; outputNodeNum++){
            outputs.push(this.calculateNodeOutput(inputValues,outputNodeNum));
        }
        return outputs;
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    change(){
        let randomRow = getRandomInt(0,this.weights.length-1);
        let randomCol = getRandomInt(0,this.weights[randomRow].length-1);
        this.weights[randomRow][randomCol] += getRandomDouble(-CHANGE_RATE,CHANGE_RATE);

        let randomBias = getRandomInt(0,this.biases.length-1);
        this.biases[randomBias] += getRandomDouble(-CHANGE_RATE,CHANGE_RATE);
    }
}

class NeuralNetwork{
    constructor(layerSizes,neuralNetwork=null){
        let layers = [];
        if (neuralNetwork === null){
            for(let i = 1; i < layerSizes.length; i++){
                layers.push(new Layer(layerSizes[i-1],layerSizes[i]));
            }
        } else {
            for(let i = 1; i < layerSizes.length; i++){
                layers.push(new Layer(layerSizes[i-1],layerSizes[i],neuralNetwork.layers[i-1]));
            }
        }
        this.layers = layers;
    }

    calculateOutput(inputs){
        let outputs = this.layers[0].calculateRowOutput(inputs);
        for(let layerNum = 1; layerNum < this.layers.length; layerNum++){
            outputs = this.layers[layerNum].calculateRowOutput(outputs);
        }
        return outputs;
    }

    getLayerSizes(){
        let layerSizes = [];
        this.layers.forEach(layer => {
            layerSizes.push(layer.numNodesIn);
        });
        layerSizes.push(this.layers[this.layers.length-1].numNodesOut);
        return layerSizes;
    }

    change(){
        let randomNum = getRandomInt(0,this.layers.length-1);
        this.layers[randomNum].change();
    }

    tournament(){
        let networks = [];
        let layerSizes = this.getLayerSizes();
        for(let i = 0; i < SIMULATION_SIZE; i++){
            let currentNN = new NeuralNetwork(layerSizes,this);
            currentNN.change();
            networks.push(currentNN);
        }
        for(let round = 0; round < Math.log2(SIMULATION_SIZE); round++){
            let networkHalfLength = Math.floor(networks.length / 2);
            for(let match = 0; match < networkHalfLength; match++){
                let loser = this.playMatch(networks[match],networks[match+1]);
                networks.splice(networks.indexOf(loser), 1);
            }
        }
        return networks;
    }

    playMatch(neuralNetwork1, neuralNetwork2){
        let tickTacToe = new TickTacToe();
        while(tickTacToe.checkWinner() === 0 && !tickTacToe.isDraw()){
            neuralNetwork1.takeTickTacToeSpot(1,tickTacToe);
            neuralNetwork2.takeTickTacToeSpot(-1,tickTacToe);
        }
        let winner1 = tickTacToe.checkWinner();
        tickTacToe.clear();
        while(tickTacToe.checkWinner() === 0 && !tickTacToe.isDraw()){
            neuralNetwork2.takeTickTacToeSpot(1,tickTacToe);
            neuralNetwork1.takeTickTacToeSpot(-1,tickTacToe);
        }
        tickTacToe.draw();
        let winner2 = -tickTacToe.checkWinner();
        let finalWinner = winner1 + winner2;
        if(finalWinner < 0){
            return neuralNetwork1;
        } else {
            return neuralNetwork2;
        }
    }

    takeTickTacToeSpot(side,tickTacToe){
        let outputs = this.calculateOutput(tickTacToe.expandBoard(side));
        const sorted = outputs.toSorted((a, b) => b - a);
        for(var i  = 0; i < outputs.length; i++){
            let outputIndex = outputs.indexOf(sorted[i]);
            let row = Math.floor(outputIndex / 3);
            let col = outputIndex % 3;
            if(tickTacToe.validSpot(row,col)){
                tickTacToe.takeSpot(row,col,side);
                break;
            }
        }
    }
}

function getRandomDouble(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

let NN = new NeuralNetwork([9,3,3,3,9]);
console.log(NN);
console.log(NN.tournament());