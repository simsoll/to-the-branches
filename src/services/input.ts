export const getInputService = (keyboard: Phaser.Keyboard, keyCodes: number[]) => {
	const keySignals = keyCodes.map((keyCode: number) => {
        return keyboard.addKey(keyCode);
    });

	const addListeners = (keyCode: number, downListener: Function, upListener: Function, context: any) : void => {
        const keySignal = keySignals.filter((key: Phaser.Key) => key.keyCode === keyCode)[0];

        if (keySignal) {
            keySignal.onDown.add(downListener, context);
            keySignal.onUp.add(upListener, context);
        }
	};

    const update = () => {
        //TODO: Actions!
    }    

    return {
        addListeners: addListeners,
        update: update
    } as InputService;
};

export interface KeySignal {
    key: Phaser.Key;
    down: Phaser.Signal;
    up: Phaser.Signal;
}

export interface InputService {
    addListeners(keyCode: number, downListener: Function, upListener: Function, context: any): void;
    update(): void;
}