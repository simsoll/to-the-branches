import { BRICK_SPRITE_KEY } from '../common/sprites';

export const brickFactoryWrapper = (game: Phaser.Game) => {
	const factory = new Phaser.GameObjectFactory(game);

	const create = (x: number, y: number): Brick => {
		const sprite = factory.sprite(x, y, BRICK_SPRITE_KEY);

        // Make sure the brick won't move when the ball hits it
        sprite.body.immovable = true;
  
        return {
            sprite
        } as Brick;   
    } 

	return {
		create: create
    }
}

export interface Brick {
	sprite: Phaser.Sprite;
}