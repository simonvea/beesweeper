function restart(canvas: HTMLCanvasElement, totalBees:number) {
  game = new Game(canvas, totalBees);
  game.start();
}