"use strict";
var Game = /** @class */ (function () {
    function Game(canvas, totalBees) {
        this.canvas = canvas;
        this.totalBees = totalBees;
        this.gameOver = false;
        this.correctlyFlagged = 0;
        this.flagged = 0;
        this.cellsLeft = Infinity;
        this.cellWidth = Math.min(this.canvas.height, this.canvas.width) / 10;
        this.cols = Math.floor(this.canvas.width / this.cellWidth);
        this.rows = Math.floor(this.canvas.height / this.cellWidth);
        this.options = [];
        var grid = make2dArray(this.rows, this.cols);
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                grid[i][j] = new Cell(i, j, this.cellWidth);
            }
        }
        this.grid = grid;
        this.score = 0;
    }
    Game.prototype.start = function () {
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.grid[i][j].show(this.canvas);
            }
        }
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.options.push([i, j]);
            }
        }
        //distribute bees
        for (var n = 0; n < this.totalBees; n++) {
            var index = Math.floor(Math.random() * (this.options.length));
            var _a = this.options.splice(index, 1)[0], i = _a[0], j = _a[1];
            this.grid[i][j].bee = true;
        }
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.grid[i][j].countNeighboors(this.grid);
            }
        }
    };
    Game.prototype.updateGame = function () {
        this.correctlyFlagged = 0;
        this.flagged = 0;
        this.cellsLeft = 0;
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                var cell = this.grid[i][j];
                if (cell.revealed && cell.bee) {
                    this.gameOver = true;
                    break;
                }
                if (cell.flagged)
                    this.flagged++;
                if (cell.flagged && cell.bee)
                    this.correctlyFlagged++;
                if (cell.flagged && !cell.bee)
                    this.correctlyFlagged--;
                if (!cell.flagged || !cell.revealed)
                    this.cellsLeft++;
            }
        }
        if (this.correctlyFlagged === this.totalBees || this.cellsLeft === 0)
            this.gameOver = true;
    };
    Game.prototype.showAll = function () {
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                var cell = this.grid[i][j];
                if (!cell.revealed)
                    cell.reveal(this.canvas, this.grid);
                if (cell.flagged && cell.bee) {
                    this.score++;
                }
                if (cell.flagged && !cell.bee) {
                    this.score--;
                }
            }
        }
    };
    return Game;
}());
