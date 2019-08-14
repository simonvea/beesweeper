"use strict";
var slider = document.querySelector('#mines');
var numberOfMines = slider.value;
var canvas = document.querySelector('canvas');
var flaggedElement = document.getElementById('flagged');
var restartButton = document.querySelector('#restart');
var CANVAS_HEIGHT = 400;
var CANVAS_WIDTH = 400;
var TOTAL_BEES = 10;
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
var game;
restart(canvas, TOTAL_BEES);
restartButton.addEventListener('click', function () { return restart(canvas, TOTAL_BEES); });
canvas.oncontextmenu = function () { return false; };
canvas.addEventListener('mousedown', handleClick);
function handleClick(event) {
    event.preventDefault();
    var rect = this.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    if (event.button === 2) { //right-click
        for (var i = 0; i < game.cols; i++) {
            for (var j = 0; j < game.rows; j++) {
                if (game.grid[i][j].contains(x, y)) {
                    game.grid[i][j].flag(this);
                }
            }
        }
    }
    else {
        for (var i = 0; i < game.cols; i++) {
            for (var j = 0; j < game.rows; j++) {
                if (game.grid[i][j].contains(x, y)) {
                    if (game.grid[i][j].flagged) {
                        game.grid[i][j].flagged = false;
                    }
                    game.grid[i][j].reveal(this, game.grid);
                }
            }
        }
    }
    game.updateGame();
    flaggedElement.textContent = String(game.flagged);
    if (game.gameOver) {
        game.showAll();
        flaggedElement.textContent = "Du scoret " + game.score + " av " + game.totalBees + " mulige.";
    }
}
;
