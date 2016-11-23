import { Factory } from './factory'
import { PLAYER_IDLE_SPRITE_KEY } from '../common/sprites';

export interface Player extends Phaser.Sprite {
    moveLeft(): void;
    moveRight(): void;
	attack(): void;
    refresh(): void;
}

export const getPlayerFactory = (game: Phaser.Game) => {
	const factory = new Phaser.GameObjectFactory(game);

	const acceleration = 50;
	const maxVelocity = 200;

    let actions = new Set<Action>();

    const moveLeft = () => {
        actions.add({
            kind: "left",  
            transform: (sprite: Phaser.Sprite) => {
                sprite.body.velocity.x += -acceleration;
                return sprite;
            } 
        });
    };
    const moveRight = () => {
        actions.add({
            kind: "right",                 
            transform: (sprite: Phaser.Sprite) => {
                sprite.body.velocity.x += acceleration;
                return sprite;
            } 
        });
    };
	const attack = () => {
        actions.add({
            kind: "attack",                 
            playAnimation: (animationManager: Phaser.AnimationManager) => {
                animationManager.play(ANIMATION_ATTACK_KEY, 20, false, false);
            } 
        });
    }

	const create = (x: number, y: number): Player => {		
		let sprite = factory.sprite(x, y, PLAYER_IDLE_SPRITE_KEY);
        sprite.animations.add(ANIMATION_IDLE_KEY, Array.from(Array(4).keys()));

        sprite.anchor.set(0.5,1);

        // Make sure the paddle won't move when it hits the ball
        sprite.body.immovable = true;
        sprite.body.collideWorldBounds = true;

		//ensure velocity descreases over time when the player is inactive
        sprite.body.drag.x = 200;

        const refresh = () => {
            actions.forEach((action: Action) => {
                switch(action.kind) {
                    case "left": 
                    case "right": 
                    	sprite = action.transform(sprite);
                        break;
                    case "attack":
                    	action.playAnimation(sprite.animations);
                        break;
                }
            });

            sprite.body.velocity.x = Phaser.Math.clamp(sprite.body.velocity.x, -maxVelocity, maxVelocity);

            actions.clear();
        };

        sprite.animations.play(ANIMATION_IDLE_KEY, 6, true, false);
        sprite.scale.set(4);

        return Object.assign(sprite, {
            moveLeft: moveLeft,
            moveRight: moveRight,
            refresh: refresh
        }) as Player;
    } 

	return {
		create: create
    } as Factory<Player>
}

type Action = Left | Right | Attack;

interface Transform {
    transform(sprite: Phaser.Sprite): Phaser.Sprite;
}

interface PlayAnimation {
    playAnimation(animationManager: Phaser.AnimationManager): void;
}

interface Left extends Transform {
    kind: "left";
}

interface Right extends Transform {
    kind: "right";
}

interface Attack extends PlayAnimation {
    kind: "attack";
}
const ANIMATION_ATTACK_KEY = 'attack';
const ANIMATION_IDLE_KEY = 'idle';
