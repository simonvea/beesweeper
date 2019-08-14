class Game {
  gameOver: boolean;
  correctlyFlagged: number;
  flagged: number;
  cellsLeft: number;
  grid: Array<Array<Cell>>;
  cellWidth: number;
  cols: number;
  rows: number;
  options: Array<Array<number>>;
  score: number;

  constructor(public canvas: HTMLCanvasElement, public totalBees: number) {
    this.gameOver = false;
    this.correctlyFlagged = 0;
    this.flagged = 0;
    this.cellsLeft = Infinity;
    this.cellWidth = Math.min(this.canvas.height, this.canvas.width)/10;
    this.cols = Math.floor(this.canvas.width / this.cellWidth);
    this.rows = Math.floor(this.canvas.height / this.cellWidth);
    this.options = [];
    const grid = make2dArray(this.rows, this.cols);
    for(let i = 0; i < this.cols; i++) {
      for(let j = 0; j < this.rows; j++) {
        grid[i][j] = new Cell(i, j, this.cellWidth);
      }
    }
    this.grid = grid;
    this.score = 0;
  }

  start() {
    for(let i = 0; i < this.cols; i++) {
      for(let j = 0; j < this.rows; j++) {
        this.grid[i][j].show(this.canvas);
      }
    }
  
    for(let i = 0; i < this.cols; i++) {
      for(let j = 0; j < this.rows; j++) {
        this.options.push([i,j]);
      }
    }
  
    //distribute bees
    for(let n = 0; n < this.totalBees; n++) {
        const index = Math.floor(Math.random()*(this.options.length));
        const [i, j] = this.options.splice(index,1)[0];
        this.grid[i][j].bee = true;
    }
  
    for(let i = 0; i < this.cols; i++) {
      for(let j = 0; j < this.rows; j++) {
        this.grid[i][j].countNeighboors(this.grid);
      }
    }
  }

  updateGame() {
    this.correctlyFlagged = 0;
    this.flagged = 0;
    this.cellsLeft = 0;
    for(let i = 0; i < this.cols; i++) {
      for(let j = 0; j < this.rows; j++) {
        const cell = this.grid[i][j];
        if(cell.revealed && cell.bee) {
          this.gameOver = true;
          break;
        }
        if(cell.flagged) this.flagged++
        if(cell.flagged && cell.bee) this.correctlyFlagged++
        if(cell.flagged && !cell.bee) this.correctlyFlagged--
        if(!cell.flagged || !cell.revealed) this.cellsLeft++
      }
    }
    if(this.correctlyFlagged === this.totalBees || this.cellsLeft === 0) this.gameOver = true;
  }

  showAll() {

    for(let i = 0; i < this.cols; i++){
      for(let j = 0; j < this.rows; j++) {
        const cell = this.grid[i][j];
        if(!cell.revealed) cell.reveal(this.canvas, this.grid);
          if(cell.flagged && cell.bee) {
            this.score++;
          }
          if(cell.flagged && !cell.bee) {
            this.score--;
          }
        }
      }
  }
}