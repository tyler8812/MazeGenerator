
var cols;
var rows;
var w = 20;
var grid = [];

var current;

var stack = [];

function setup() {
    createCanvas(400, 400);
    cols = floor(width / w);
    rows = floor(height / w);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            var cell = new Cell(i, j);
            grid.push(cell);
        }
    }
    current = grid[0];
}

function draw() {
    background(51);
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    current.visted = true;
    var next = current.checkNeighbors();
    if (next) {
        next.visted = true;

        stack.push(current);

        removeWalls(current, next);
        current = next;
        if(current.i == rows-1 && current.j == cols-1){
            stack.push(current);
            noFill();
            stroke(0, 255, 123);
            strokeWeight(w/4);
            beginShape();
            for (let i = 0; i < stack.length; i++) {
                vertex(stack[i].i * w + w / 2, stack[i].j * w + w / 2);
            }
            endShape();
            noLoop();
        }
        current.highlight();
    } else if (stack.length > 0) {
        current = stack.pop();
    }
}
function index(i, j) {
    if (i < 0 || j < 0 || i > rows - 1 || j > cols - 1) {
        return -1;
    }

    return i * cols + j;
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.visted = false;
    this.walls = [true, true, true, true];

    this.checkNeighbors = function () {
        var neighbors = [];

        var top = grid[index(i - 1, j)];
        var right = grid[index(i, j + 1)];
        var bottom = grid[index(i + 1, j)];
        var left = grid[index(i, j - 1)];

        if (top && !top.visted) {
            neighbors.push(top);
        }
        if (right && !right.visted) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visted) {
            neighbors.push(bottom);
        }
        if (left && !left.visted) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            var r = floor(random(0, neighbors.length));
            return neighbors[r];
        } else {
            return undefined;
        }
    }

    this.highlight = function () {
        var x = this.i * w;
        var y = this.j * w;
        noStroke();
        fill(0, 0, 255, 100);
        rect(x, y, w, w);
    }

    this.show = function () {
        var x = this.i * w;
        var y = this.j * w;
        stroke(255);
        if (this.walls[0]) {
            line(x, y, x + w, y);
        }
        if (this.walls[1]) {
            line(x + w, y, x + w, y + w);
        }
        if (this.walls[2]) {
            line(x + w, y + w, x, y + w);
        }
        if (this.walls[3]) {
            line(x, y + w, x, y);
        }

        if (this.visted) {
            noStroke();
            fill(255, 0, 255, 100);
            rect(x, y, w, w);
        }
    }
}


function removeWalls(a, b) {
    var x = a.i - b.i;
    var y = a.j - b.j;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}