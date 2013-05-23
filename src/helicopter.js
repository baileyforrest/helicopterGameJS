/**
 * Helicopter object
 * 
 */

var HELI_WIDTH = 50;
var HELI_HEIGHT = 25;
var GRAV_ACCEL = 800; // pixels / s^2
var THRUST_ACCEL = 1200; // pixels / s^2

function Helicopter() {
    this.yPos = 0; // position
    this.yVel = 0; // velocity
    this.thrust = false; // whether or not going up

    // Helicopter image
    this.view = new Kinetic.Rect({
        x: stage.getWidth() / 4,
        y: stage.getHeight() / 2 - HELI_HEIGHT / 2,
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

// Turn thrust on and off
Helicopter.prototype.toggleThrust = function() {
    this.yVel /= 4;
    this.thrust = !this.thrust;
}
