const slider = <HTMLInputElement> document.querySelector('#mines');
let numberOfMines = slider.value;
const canvas = <HTMLCanvasElement> document.querySelector('canvas');
const flaggedElement = <HTMLTitleElement> document.getElementById('flagged');
const restartButton = <HTMLButtonElement> document.querySelector('#restart');

const CANVAS_HEIGHT: number = 400;
const CANVAS_WIDTH: number = 400;
const TOTAL_BEES: number = 10;

canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
let game: Game;
restart(canvas, TOTAL_BEES);

restartButton.addEventListener('click', () => restart(canvas, TOTAL_BEES));

canvas.oncontextmenu = () => false;
canvas.addEventListener('mousedown', handleClick);

let touchStart = 0;
let touchEnd = 0;

canvas.addEventListener('touchend', handleTouch);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  touchStart = Date.now();
})

function handleClick(this: HTMLCanvasElement, event: MouseEvent) {
    event.preventDefault();
    if(game.gameOver) return;

    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(event.button === 2) { //right-click
      for(let i = 0; i < game.cols; i++) {
        for(let j = 0; j < game.rows; j++) {
          if(game.grid[i][j].contains(x,y)) {
            game.grid[i][j].flag(this);
          }
        }
      }
    } else {
      for(let i = 0; i < game.cols; i++) {
        for(let j = 0; j < game.rows; j++) {
          if(game.grid[i][j].contains(x,y)) {
            if(game.grid[i][j].flagged){
              game.grid[i][j].flagged = false;
            } 
            game.grid[i][j].reveal(this, game.grid);
          }
        }
      }
    }
    game.updateGame();
    flaggedElement.textContent = String(game.flagged);

    if(game.gameOver) {
      game.showAll();
      flaggedElement.textContent = `Du scoret ${game.score} av ${game.totalBees} mulige.`;
    } 
  };

  function handleTouch(this: HTMLCanvasElement, event: TouchEvent) {
    event.preventDefault();
    touchEnd = Date.now();
    const rect = this.getBoundingClientRect();

    const x = event.targetTouches[0].clientX - rect.left;
    const y = event.targetTouches[0].clientY - rect.top;
    if(touchEnd - touchStart > 500) {
      for(let i = 0; i < game.cols; i++) {
        for(let j = 0; j < game.rows; j++) {
          if(game.grid[i][j].contains(x,y)) {
            game.grid[i][j].flag(this);
          }
        }
      }
    } else {
      for(let i = 0; i < game.cols; i++) {
        for(let j = 0; j < game.rows; j++) {
          if(game.grid[i][j].contains(x,y)) {
            if(game.grid[i][j].flagged){
              game.grid[i][j].flagged = false;
            } 
            game.grid[i][j].reveal(this, game.grid);
          }
        }
      }
    }
    game.updateGame();
    flaggedElement.textContent = String(game.flagged);

    if(game.gameOver) {
      game.showAll();
      flaggedElement.textContent = `Du scoret ${game.score} av ${game.totalBees} mulige.`;
    } 
  }