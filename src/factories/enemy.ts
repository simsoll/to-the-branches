import { Factory } from './factory'
import { 
    ENEMY_KEY
} from '../common/keys';

import { Player } from './player';

export interface Enemy extends Phaser.Sprite {
    jump(): void;
    moveLeft(): void;
    moveRight(): void;
	attack(): void;
    refresh(player: Player): void;
}

export const getEnemyFactory = (game: Phaser.Game) => {
	const factory = new Phaser.GameObjectFactory(game);

	const acceleration = 50;
	const maxVelocity = 150;

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

	const jump = () => {
        actions.add({
            kind: "jump",
            transform: (sprite: Phaser.Sprite) => {
                if (sprite.body.onFloor()) {
					sprite.body.velocity.y = -500;
                }
                return sprite;
            }
        });
    };

	const create = (x: number, y: number): Enemy => {		
		let sprite = factory.sprite(x, y, ENEMY_KEY);
		
        sprite.anchor.set(0.5,1);

		//resize body as sprite is larger than the actual border
		sprite.body.setSize(16, 32, 8, 0);
        sprite.body.bounce.y = 0.1;
        sprite.body.gravity.y = 800;
        sprite.body.collideWorldBounds = true;

		//ensure velocity descreases over time when the enemy is inactive
        sprite.body.drag.x = 800;

        const refresh = (player: Player) => {
            // simple AI
			if (player.body.x < sprite.body.x - 10) {
                moveLeft();
            }            
            else if (sprite.body.x + 10  < player.body.x) {
                moveRight();
            }
			if (player.body.y + 100 < sprite.body.y) {
                jump();
            }

            actions.forEach((action: Action) => {
                switch(action.kind) {
                    case "left": 
                    case "right": 
                    case "jump": 
                    	sprite = action.transform(sprite);
                        break;
                }
            });

            sprite.body.velocity.x = Phaser.Math.clamp(sprite.body.velocity.x, -maxVelocity, maxVelocity);

            actions.clear();
        };

        return Object.assign(sprite, {
            jump: jump,
            moveLeft: moveLeft,
            moveRight: moveRight,
            refresh: refresh
        }) as Enemy;
    }

	return {
		create: create
    } as Factory<Enemy>
}

type Action = Left | Right | Jump;

interface Transform {
    transform(sprite: Phaser.Sprite): Phaser.Sprite;
}

interface Left extends Transform {
    kind: "left";
}

interface Right extends Transform {
    kind: "right";
}

interface Jump extends Transform {
    kind: "jump";
}