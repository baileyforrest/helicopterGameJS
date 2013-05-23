/*
 * walls.js - Walls for the helicopter game
 *
 */

var WALL_WIDTH = 40; // width of wall segments

// Number of walls in the width of the screen
var NUM_WALLS = Math.round((STAGE_WIDTH / WALL_WIDTH) + .5);
var STARTING_GAPS = 25; // Starting height of the ceiling and floor

// Starting distance between floor and ceiling
var STARTING_HEIGHT = STAGE_HEIGHT - 2 * STARTING_GAPS; 

// Every BLOCK_INTERVAL wall blocks, put a block in the middle
var BLOCK_INTERVAL = 10;
var BLOCK_HEIGHT = 120; // Height of blocks in the middle
var MAX_DIFF = 20; // Max difference for the between wall sections

function Walls(layer) {
    this.ceiling = [];
    this.floor = [];
    this.blocks = [];
    this.layer = layer;
    this.newCnt = 0; // Keep track of walls added
    this.height = STARTING_HEIGHT; // current distance between floor/ceiling
    this.direction = 1; // direction of the wall change
    this.ceilY = STARTING_GAPS; // height of ceiling
    this.interval = this.getDiff(); // interval of wall changes



    // Initialize the floor and ceiling
    var startx = 0;
    for (var i = 0; i < NUM_WALLS + 2; i++, startx += WALL_WIDTH) {
        this.ceiling.push(new Kinetic.Rect({
            x: startx,
            y: 0,
            width: WALL_WIDTH,
            height: STARTING_GAPS,
            fill: 'green'
        }));

        this.floor.push(new Kinetic.Rect({
            x: startx,
            y: STAGE_HEIGHT - STARTING_GAPS,
            width: WALL_WIDTH,
            height: STARTING_GAPS,
            fill: 'green'
        }));
    }

    this.addAllWallsLayer();
}

// Add all of the blocks in the walls to the layer
Walls.prototype.addAllWallsLayer = function() {
    this.ceiling.map(function(elem) { this.layer.add(elem); });
    this.floor.map(function(elem) { this.layer.add(elem); });
};

// Get a step amount for the ceiling and floor
Walls.prototype.getDiff = function() {
    return MAX_DIFF * Math.random() + 2;
};

// Move the walls based on time difference from last frame
Walls.prototype.update = function(timeDiff) {
    var newCeil, newFloor, newBlock, hCeil, hFloor,
    outOfBounds = (
        this.ceiling[0].getX() + WALL_WIDTH < 0
        && this.floor[0].getX() + WALL_WIDTH < 0
    ),
    xDiff = timeDiff * HELI_XVEL / 1000;

    // Move all of the blocks back
    this.ceiling.map(function(elem) { elem.setX(elem.getX() - xDiff); });
    this.floor.map(function(elem) { elem.setX(elem.getX() - xDiff); });
    this.blocks.map(function(elem) { elem.setX(elem.getX() - xDiff); });

    // Wall out of bounds, delete it, make a new one
    if (outOfBounds) {

        // Remove the out of bounds wall segments
        this.ceiling[0].remove();
        this.floor[0].remove();
        this.ceiling.shift();
        this.floor.shift();

        // Y coordinate for new wall segment.
        // New walls appear in zig-zag pattern
        this.ceilY += this.interval * this.direction;
        if (this.ceilY < 0 || this.ceilY + this.height > STAGE_HEIGHT) {
            this.ceilY -= this.interval * this.direction;
            this.direction = -this.direction;
            this.interval = this.getDiff();
            this.ceilY += this.interval * this.direction;
        }

        hCeil = this.ceilY;
        hFloor = STAGE_HEIGHT - this.height - hCeil;

        // Add a new block if its time
        if (++this.newCnt == BLOCK_INTERVAL) {
            this.height--; // for each new block, less space between floor/ceil
            this.newCnt = 0;
            newBlock = new Kinetic.Rect({
                x: this.ceiling[this.ceiling.length - 1].getX() + WALL_WIDTH,
                y: Math.round((this.height - BLOCK_HEIGHT) * Math.random() +
                              hCeil),
                width: WALL_WIDTH,
                height: BLOCK_HEIGHT,
                fill: 'green'
            });
            this.blocks.push(newBlock);
            this.layer.add(newBlock);
        }

        // Add new ceiling segment
        newCeil = new Kinetic.Rect({
            x: this.ceiling[this.ceiling.length - 1].getX() + WALL_WIDTH,
            y: 0,
            width: WALL_WIDTH,
            height: hCeil,
            fill: 'green'
        });
        this.ceiling.push(newCeil);
        this.layer.add(newCeil); // Add the new block to the layer

        // Add new floor segment
        newFloor = new Kinetic.Rect({
            x: this.ceiling[this.ceiling.length - 1].getX() + WALL_WIDTH,
            y: STAGE_HEIGHT - hFloor,
            width: WALL_WIDTH,
            height: hFloor,
            fill: 'green'
        });

        this.floor.push(newFloor);
        this.layer.add(newFloor);

        // check if the block needs to be removed
        if (this.blocks.length > 0 &&
            (this.blocks[0].getX() + WALL_WIDTH < 0)) {
            this.blocks[0].remove();
            this.blocks.shift();
        }
    }
};
