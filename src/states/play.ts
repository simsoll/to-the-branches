import * as Phaser from 'phaser';
import { getInputService, InputService } from '../services/input';

import { LOSE_STATE, WIN_STATE } from '../common/states';

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
            inputService: getInputService(game.input.keyboard, [Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]) 
        };
    }

    const create = () => {
        // Add the physics engine to all the game objetcs
        game.world.enableBody = true;

		const factories = factoriesWrapper(game);

		state.player = factories.playerFactory.create(200,400);

        // Setup input service
		state.inputService = servicesWrapper(game).inputService;
        state.inputService.addListeners(Phaser.Keyboard.LEFT, state.player.moveLeft, () => {}, state.player);
        state.inputService.addListeners(Phaser.Keyboard.RIGHT, state.player.moveRight, () => {}, state.player);
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