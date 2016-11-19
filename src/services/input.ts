export const inputService = (keyboard: Phaser.Keyboard, keyCodes: number[]) => {
	const keySignals = keyCodes.map((keyCode: number) => {
        return keyboard.addKey(keyCode);
    }).map((key: Phaser.Key) => {
        return {
			key: key,
            down: new Phaser.Signal(),
            up: key.onUp            
        } as KeySignal
    });

	const addListeners = (keyCode: number, downListener: Function, upListener: Function, context: any) : void => {
        const keySignal = keySignals.find((keySignal: KeySignal) => keySignal.key.keyCode === keyCode);

        if (keySignal) {
            keySignal.down.add(downListener, context);
            keySignal.up.add(upListener, context);
        }
	};

    const update = () => {
        keySignals.forEach((keySignal: KeySignal) => {
			if(keySignal.key.isDown) {
                keySignal.down.dispatch();
            }
            else if(keySignal.key.isUp) {
                keySignal.down.dispatch();
            }
        });
    }    

    return {
        addListeners: addListeners,
        update: update
    }
}

interface KeySignal {
    key: Phaser.Key;
    down: Phaser.Signal;
    up: Phaser.Signal;
}