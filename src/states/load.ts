import { MENU_STATE, PLAY_STATE } from '../common/states';
import { 
    PLAYER_ATTACK_SPRITE_KEY, 
    PLAYER_IDLE_SPRITE_KEY, 
    PLAYER_KEY,
	TILES_TILEMAP_KEY,  
    TILES_IMAGE_KEY
} from '../common/keys';
import { header } from '../common/styles';

export const loadState = (game: Phaser.Game) => {
    const preload = () => {
        game.add.text(80, 150, 'loading...', header);

        game.load.tilemap(TILES_TILEMAP_KEY, 'assets/tilemaps/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image(TILES_IMAGE_KEY, 'assets/tilemaps/tiles/ground-tiles.png');

        game.load.spritesheet(PLAYER_ATTACK_SPRITE_KEY, './assets/images/swordsman-attack.png', 64, 64);
        game.load.spritesheet(PLAYER_IDLE_SPRITE_KEY, './assets/images/swordsman-idle.png', 64, 64);
        game.load.spritesheet(PLAYER_KEY, './assets/images/player.png', 64, 64);
	};

    const create = () => {
        // game.state.start(MENU_STATE);
        game.state.start(PLAY_STATE); //while developing go directly to play-state!
    };

    return {
        preload: preload,
        create: create
    } as Phaser.State;
};