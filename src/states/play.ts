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

interface PlayState {
	player?: Player;
    inputService?: InputService
}

export const playState = (game: Phaser.Game) => {
	
    let state = {} as PlayState;

    const factoriesWrapper = (game: Phaser.Game) => {
        return {
            playerFactory: getPlayerFactory(game),
        };
    }

    const servicesWrapper = (game: Phaser.Game) => {
	    return {
            inputService: getInputService(game.input.keyboard, [Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]) 
        };
    }

    const create = () => {
        // Add the physics engine to all the game objetcs
        game.world.enableBody = true;

		let map = game.add.tilemap(TILES_TILEMAP_KEY);
        map.addTilesetImage(TILES_TILEMAP_NAME_KEY, TILES_IMAGE_KEY);
		
		let layer = map.createLayer(LAYER_KEY);
        layer.resizeWorld();


		const factories = factoriesWrapper(game);

		state.player = factories.playerFactory.create(200,400);

        // Setup input service
		state.inputService = servicesWrapper(game).inputService;
        state.inputService.addListeners(Phaser.Keyboard.LEFT, state.player.moveLeft, () => {}, state.player);
        state.inputService.addListeners(Phaser.Keyboard.RIGHT, state.player.moveRight, () => {}, state.player);
        state.inputService.addListeners(Phaser.Keyboard.SPACEBAR, state.player.attack, () => {}, state.player);
    }

    
    const update = () => {
        state.inputService.update();

        state.player.refresh();
    }

	return {
        create: create,
        update: update
    } as Phaser.State;    
};