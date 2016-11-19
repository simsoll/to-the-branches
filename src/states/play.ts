import * as Phaser from 'phaser';
import { inputService } from '../services/input';

import { LOSE_STATE, WIN_STATE } from '../common/states';

import { ballFactoryWrapper, Ball } from '../factories/ball';
import { brickFactoryWrapper, Brick } from '../factories/brick';
import { paddleFactoryWrapper, Paddle } from '../factories/paddle';

export const playState = (game: Phaser.Game) => {
	const ballFactory = ballFactoryWrapper(game);
    const brickFactory = brickFactoryWrapper(game);
    const paddleFactory = paddleFactoryWrapper(game);
    const input = inputService(game.input.keyboard, [Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
	
	const paddle = paddleFactory.create(200,400);
    const ball = ballFactory.create(200, 300);		

	// Create a group that will contain all the bricks
    const bricks = game.add.group();

    // Add 25 bricks to the group (5 columns and 5 lines)
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            // Create the brick at the correct position
            const brick = brickFactory.create(55 + i * 60, 55 + j * 35);

            bricks.add(brick);
        }
    }

    const ballHitPaddle = (ball: Ball, paddle: Paddle) => {
        ball.sprite.body.velocity.x = -1 * 5 * (paddle.sprite.x - ball.sprite.x);
    };

    const ballHitBrick = (ball: Ball, brick: Brick) => {
        brick.sprite.kill();
    };

    const create = () => {
        // Add the physics engine to all the game objetcs
        game.world.enableBody = true;

        // Setup input service
        input.addListeners(Phaser.Keyboard.LEFT, paddle.moveLeft, paddle.stop, paddle);
        input.addListeners(Phaser.Keyboard.RIGHT, paddle.moveRight, paddle.stop, paddle);
    }

    
    const update = () => {
        // Here we update the game 60 times per second

        input.update();

        // Add collisions between the paddle and the ball
        game.physics.arcade.collide(ball, paddle, ballHitPaddle);

        // Call the 'hit' function when the ball hits a brick
        game.physics.arcade.collide(ball, bricks, ballHitBrick);

        // If the ball is below the paddle then game over!
        if (ball.sprite.y > paddle.sprite.y) {
            game.state.start(LOSE_STATE);
        }

        if (bricks.countLiving() === 0) {
            game.state.start(WIN_STATE);
        }
    }
};