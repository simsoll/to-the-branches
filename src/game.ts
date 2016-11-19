/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>

import 'pixi';
import 'p2';
import * as Phaser from 'phaser';

import * as states from './states';
import { BOOT_STATE } from './common/states';

var game = new Phaser.Game(400, 450, Phaser.AUTO, 'content');

Object.keys(states).forEach(state => game.state.add(state, states[state]));

game.state.start(BOOT_STATE);