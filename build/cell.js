"use strict";
var Cell = /** @class */ (function () {
    function Cell(i, j, w) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.flagged = false;
        this.bee = false;
        this.revealed = false;
        this.x = i * this.w;
        this.y = j * this.w;
        this.neighboorCount = 0;
    }
    Cell.prototype.show = function (canvas) {
        var ctx = canvas.getContext('2d');
        //clear cell
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.clearRect(this.x, this.y, this.w, this.w);
        //add cell content
        if (this.flagged && !this.revealed) {
            ctx.fillStyle = '#F08080';
        }
        if (this.revealed && !this.bee) {
            ctx.fillStyle = '#DCDCDC';
        }
        if (this.revealed && this.bee && this.flagged) {
            ctx.fillStyle = '#00FF00';
        }
        ctx.fillRect(this.x, this.y, this.w, this.w);
        ctx.rect(this.x, this.y, this.w, this.w);
        ctx.stroke();
        if (this.revealed && this.bee && !this.flagged) {
            var centerX = this.x + 0.5 * this.w;
            var centerY = this.y + 0.5 * this.w;
            var radius = 0.5 * 0.6 * this.w;
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
        if (this.revealed && this.neighboorCount) {
            ctx.font = "20px Arial";
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.fillText(String(this.neighboorCount), this.x + 0.5 * this.w, this.y + 0.75 * this.w);
        }
    };
    Cell.prototype.countNeighboors = function (grid) {
        if (this.bee)
            return;
        var total = 0;
        for (var offsetX = -1; offsetX <= 1; offsetX++) {
            for (var offsetY = -1; offsetY <= 1; offsetY++) {
                var i = this.i + offsetX;
                var j = this.j + offsetY;
                if (!!grid[i] && !!grid[i][j] && grid[i][j].bee)
                    total++;
            }
        }
        this.neighboorCount = total;
    };
    Cell.prototype.contains = function (x, y) {
        return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
    };
    Cell.prototype.flag = function (canvas) {
        this.flagged = !this.flagged;
        this.show(canvas);
    };
    Cell.prototype.reveal = function (canvas, grid) {
        this.revealed = true;
        if (this.neighboorCount === 0 && !this.bee)
            this.floodFill(canvas, grid);
        this.show(canvas);
    };
    Cell.prototype.floodFill = function (canvas, grid) {
        for (var offsetX = -1; offsetX <= 1; offsetX++) {
            for (var offsetY = -1; offsetY <= 1; offsetY++) {
                var i = this.i + offsetX;
                var j = this.j + offsetY;
                if (!!grid[i] && !!grid[i][j] && !grid[i][j].bee && !grid[i][j].revealed)
                    grid[i][j].reveal(canvas, grid);
            }
        }
    };
    return Cell;
}());
