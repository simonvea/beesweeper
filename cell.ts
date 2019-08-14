
class Cell {
  bee: boolean;
  revealed: boolean;
  x: number;
  y: number;
  neighboorCount: number;
  flagged: boolean;
  constructor(public i: number, public j: number, public w: number) {
    this.flagged = false;
    this.bee = false;
    this.revealed = false;
    this.x = i * this.w;
    this.y = j * this.w;
    this.neighboorCount = 0;
  }

  show(canvas: HTMLCanvasElement) {
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');

    //clear cell
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.clearRect(this.x, this.y, this.w, this.w);

    //add cell content
    if(this.flagged && !this.revealed) {
      ctx.fillStyle = '#F08080';
    }

    if(this.revealed && !this.bee) {
      ctx.fillStyle = '#DCDCDC';
    }

    if(this.revealed && this.bee && this.flagged) {
      ctx.fillStyle = '#00FF00';
    }

    ctx.fillRect(this.x, this.y, this.w, this.w);
    ctx.rect(this.x, this.y, this.w, this.w);
    ctx.stroke()

    if(this.revealed && this.bee && !this.flagged) {
        const centerX = this.x + 0.5 * this.w;
        const centerY = this.y + 0.5 * this.w;
        const radius = 0.5 * 0.6 * this.w;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill(); 
    }

    if(this.revealed && this.neighboorCount) {
      ctx.font = "20px Arial";
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText(String(this.neighboorCount), this.x + 0.5*this.w, this.y + 0.75 * this.w); 
    }
  }

  countNeighboors(grid: Array<Array<Cell>>) {
    if(this.bee) return;
    let total = 0;
    for(let offsetX = -1; offsetX <= 1; offsetX++){
      for(let offsetY = -1; offsetY <= 1; offsetY++) {
        const i = this.i + offsetX;
        const j = this.j + offsetY;
        if(!!grid[i] && !!grid[i][j] && grid[i][j].bee) total++;
      }
    }
    this.neighboorCount = total;
  }

  contains(x:number, y:number) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w)
  }

  flag(canvas: HTMLCanvasElement) {
    this.flagged = !this.flagged;
    this.show(canvas);
  }

  reveal(canvas: HTMLCanvasElement, grid: Array<Array<Cell>>) {
    this.revealed = true;
    if(this.neighboorCount === 0 && !this.bee) this.floodFill(canvas, grid);
    this.show(canvas);
  }

  floodFill(canvas: HTMLCanvasElement, grid: Array<Array<Cell>>) {
    for(let offsetX = -1; offsetX <= 1; offsetX++){
      for(let offsetY = -1; offsetY <= 1; offsetY++) {
        const i = this.i + offsetX;
        const j = this.j + offsetY;
        if(!!grid[i] && !!grid[i][j] && !grid[i][j].bee && !grid[i][j].revealed) grid[i][j].reveal(canvas, grid)
      }
    }
  }
}
