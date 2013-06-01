/*
 * helicopter.js - clone of the helicopter game using kinetic.js
 *
 */

/*global Kinetic, STAGE_WIDTH, STAGE_HEIGHT, Helicopter, Walls,
  POINTS_PER_SECOND */

var SCORE_OFFSET = 25;

var helicopter;
var walls;
var gameOver;
var score, highScore = 0;

var background = new Kinetic.Layer();
var layer = new Kinetic.Layer();
var stats = new Kinetic.Layer();

// Create the stage
var stage = new Kinetic.Stage({
    container: 'container',
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT
});

// Black background
var bg = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    fill: 'black'
});

var scoreLabel = new Kinetic.Text({
    x: SCORE_OFFSET,
    y: STAGE_HEIGHT - SCORE_OFFSET,
    text: 'Score: 0',
    fontSize: 20,
    fontFamily: 'monospace',
    fill: 'cyan'
});

var kinHighScore = new Kinetic.Text({
    x: STAGE_WIDTH - 5 * SCORE_OFFSET,
    y: STAGE_HEIGHT - SCORE_OFFSET,
    text: 'Best: 0',
    fontSize: 20,
    fontFamily: 'monospace',
    fill: 'cyan'
});

function reset() {
    "use strict";
    layer.removeChildren();
    helicopter = new Helicopter();
    walls = new Walls(layer);
    layer.add(helicopter.view);

    stage.off('mousedown');
    // Event handlers for the mouse
    stage.on('mousedown', function () {
        helicopter.thrustOn();
    });

    stage.on('mouseup', function () {
        helicopter.thrustOff();
    });

    gameOver = false;

    score = 0;
}

background.add(bg);
stats.add(scoreLabel);
stats.add(kinHighScore);

stage.add(background);
stage.add(layer);
stage.add(stats);

reset();

var scoreAnim = new Kinetic.Animation(
    function (frame) {
        "use strict";
        scoreLabel.setText("Score: " + Math.round(score));
        kinHighScore.setText("Best: " + Math.round(highScore));
    },
    stats
);

// Handle updates for each frame
var anim = new Kinetic.Animation(
    function (frame) {
        "use strict";
        if (!gameOver) { // Only update the game if still running
            helicopter.doMove(frame.timeDiff);
            walls.update(frame.timeDiff);
            score += frame.timeDiff * POINTS_PER_SECOND / 1000;


        }

        if (helicopter.isCrashed(walls)) {
            gameOver = true;

            if (score > highScore) {
                highScore = score;
            }

            stage.off('mousedown');
            stage.on('mousedown', function () {
                stage.off('mousedown');
                reset();
            });
        }
    },
    layer
);

anim.start();
scoreAnim.start();
