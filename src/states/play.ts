import * as Phaser from 'phaser';
import { getInputService, InputService } from '../services/input';

import { LOSE_STATE, WIN_STATE } from '../common/states';

import { 
	TILES_TILEMAP_KEY,  
    TILES_IMAGE_KEY,
    TILES_TILEMAP_NAME_KEY,
    LAYER_KEY
} from '../common/keys';

import { getPlayerFactory, Player } from '../factories/player';
import { getEnemyFactory, Enemy } from '../factories/enemy';

interface PlayState {
	enemy?: Enemy;
    inputService?: InputService;
    layer: Phaser.TilemapLayer;
	player?: Player;
}

export const playState = (game: Phaser.Game) => {
	
    let state = {} as PlayState;

    const factoriesWrapper = (game: Phaser.Game) => {
        return {
            playerFactory: getPlayerFactory(game),
            enemyFactory: getEnemyFactory(game)
        };
    }

    const servicesWrapper = (game: Phaser.Game) => {
	    return {
            inputService: getInputService(game.input.keyboard, [Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]) 
        };
    }

    const create = () => {
		let map = game.add.tilemap(TILES_TILEMAP_KEY);
        map.addTilesetImage(TILES_TILEMAP_NAME_KEY, TILES_IMAGE_KEY);
		
		state.layer = map.createLayer(LAYER_KEY);
        state.layer.resizeWorld();
        map.setCollisionBetween(1, 2, true, state.layer);

		const factories = factoriesWrapper(game);

		state.player = factories.playerFactory.create(100, 400);
        state.enemy = factories.enemyFactory.create(400, 400);

        // Setup input service
		state.inputService = servicesWrapper(game).inputService;
        state.inputService.addListeners(Phaser.Keyboard.LEFT, state.player.moveLeft, () => {}, state.player);
        state.inputService.addListeners(Phaser.Keyboard.RIGHT, state.player.moveRight, () => {}, state.player);
        state.inputService.addListeners(Phaser.Keyboard.SPACEBAR, state.player.jump, () => {}, state.player);
    }

    
    const update = () => {
        state.inputService.update();
        game.physics.arcade.collide(state.player, state.layer);
        game.physics.arcade.collide(state.enemy, state.player);
        game.physics.arcade.collide(state.enemy, state.layer);

        state.player.refresh();
        state.enemy.refresh(state.player);
    }

    const render = () => {
        game.debug.bodyInfo(state.player, 32, 32);
        game.debug.body(state.player, "red", false);
    }

	return {
        create: create,
        update: update,
        render: render
    } as Phaser.State;    
};