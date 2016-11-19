import { PADDLE_SPRITE_KEY } from '../common/sprites';

export const paddleFactoryWrapper = (game: Phaser.Game) => {
	const factory = new Phaser.GameObjectFactory(game);

	const create = (x: number, y: number): Paddle => {		
		const sprite = factory.sprite(x, y, PADDLE_SPRITE_KEY);
        
        // Make sure the paddle won't move when it hits the ball
        sprite.body.immovable = true;
        sprite.body.collideWorldBounds = true;
        sprite.anchor.set(0.5,1);

		const moveLeft = function moveLeft() {
		    sprite.body.velocity.x = -300;
		};
		
		const moveRight = function moveRight() {
		    sprite.body.velocity.x = 300;
		};
		
		const stop = function stop() {
		    sprite.body.velocity.x = 0;
		};

        return {
            sprite: sprite,
            moveLeft: moveLeft,
            moveRight: moveRight,
            stop: stop
        } as Paddle;
    } 

	return {
		create: create
    }
}

export interface Paddle {
    sprite: Phaser.Sprite;
    moveLeft(): void;
    moveRight(): void;
    stop(): void;
}