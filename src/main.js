/*
 * helicopter.js - clone of the helicopter game using kinetic.js
 *
 */

function reset() {
    layer.removeChildren();
    helicopter = new Helicopter();
    walls = new Walls(layer);
    layer.add(helicopter.view);

    stage.off('mousedown');
    // Event handlers for the mouse
    stage.on('mousedown', function() {
        helicopter.thrustOn();
    });

    stage.on('mouseup', function() {
        helicopter.thrustOff();
    });

    gameOver = false;
}

// Create the stage
var stage = new Kinetic.Stage({
    container: 'container',
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT
});


var background = new Kinetic.Layer();
var layer = new Kinetic.Layer();

// Black background
var bg = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    fill: 'black'
});

background.add(bg);
stage.add(background);
stage.add(layer);

var helicopter;
var walls;
var gameOver;

reset();

// Handle updates for each frame
var anim = new Kinetic.Animation(
    function(frame) {

        if(!gameOver) { // Only update the game if still running
            helicopter.doMove(frame.timeDiff);
            walls.update(frame.timeDiff);
        }
        

        if(helicopter.isCrashed(walls)) {
            gameOver = true;
            console.log("got here");

            stage.off('mousedown');
            stage.on('mousedown', function() {
                stage.off('mousedown');
                reset();
            });
        }

        //console.log(helicopter.isCrashed(walls));
    }, layer);

anim.start();
