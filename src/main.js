/*
 * helicopter.js - clone of the helicopter game using kinetic.js
 *
 */

var stage = new Kinetic.Stage({
    container: 'container',
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT
});

var background = new Kinetic.Layer();
var layer = new Kinetic.Layer();

var bg = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    fill: 'black'
});


var helicopter = new Helicopter();
var walls = new Walls(layer);

layer.add(helicopter.view);
background.add(bg);

stage.add(background);
stage.add(layer);

stage.on('mousedown', function() {
    helicopter.toggleThrust();
});

stage.on('mouseup', function() {
    helicopter.toggleThrust();
});


var anim = new Kinetic.Animation(
    function(frame) {
        helicopter.doMove(frame.timeDiff);
        walls.update(frame.timeDiff);
    }, layer);

anim.start();


