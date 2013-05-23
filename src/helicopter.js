/**
 * Helicopter object
 * 
 */

var HELI_WIDTH = 50;
var HELI_HEIGHT = 25;
var GRAV_ACCEL = 800; // pixels / s^2
var THRUST_ACCEL = 1200; // pixels / s^2

function Helicopter() {
    this.yPos = stage.getHeight() / 2 - HELI_HEIGHT / 2; // position
    this.yVel = 0; // velocity
    this.thrust = false; // whether or not going up

    var self = this;

    // Helicopter image
    this.view = new Kinetic.Rect({
        x: stage.getWidth() / 4,
        y: self.yPos,
        width: HELI_WIDTH,
        height: HELI_HEIGHT,
        fill: 'blue'
    });
}

// Perform the move
Helicopter.prototype.doMove = function(timeDiff) {
    this.yVel += GRAV_ACCEL * timeDiff / 1000; // Force of gravity
    if (this.thrust) {
        this.yVel -= THRUST_ACCEL * timeDiff / 1000; // thrust force
    }

    // Update position and change the images position
    this.yPos += this.yVel * timeDiff / 1000;
    this.view.setY(this.yPos);
};

// Return true if Kinetic.Rect are overlapping, false otherwise
Helicopter.prototype.rectCollision = function(rect1, rect2) {
    var r1x1, r1x2, r1y1, r1y2, r2x1, r2x2, r2y1, r2y2;
    
    r1x1 = rect1.getX();
    r1x2 = r1x1 + rect1.getWidth();
    r1y1 = rect1.getY();
    r1y2 = r1y1 + rect1.getHeight();

    r2x1 = rect2.getX();
    r2x2 = r2x1 + rect2.getWidth();
    r2y1 = rect2.getY();
    r2y2 = r2y1 + rect2.getHeight();

    return (r1x1 < r2x2 && r1x2 > r2x1 && r1y1 < r2y2 && r1y2 > r2y1);
}

// return true if crashed, false otherwise
Helicopter.prototype.isCrashed = function(walls) {
    var self = this;
    mapFunc = function(rect) {
        return self.rectCollision(self.view, rect);
    }

    redFunc = function(a, b) {
        return a || b;
    }
    
    return walls.ceiling.map(mapFunc).reduce(redFunc, false) ||
        walls.floor.map(mapFunc).reduce(redFunc, false) ||
        walls.blocks.map(mapFunc).reduce(redFunc, false) ||
        this.view.getY() < 0 ||
        this.view.getY() + this.view.getHeight() > STAGE_HEIGHT;
}

// Turn thrust off
Helicopter.prototype.thrustOff = function() {
    this.yVel /= 4;
    this.thrust = false;
}

// Turn thrust on
Helicopter.prototype.thrustOn = function() {
    this.yVel /= 4;
    this.thrust = true;
}
