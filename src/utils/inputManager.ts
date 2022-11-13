import { GamepadManager } from "./inputs/gamepadManager";
import type { IInput } from "./inputs/Iinput";
import { Keyboard } from "./inputs/keyboard";

export enum KeyList {
    A = 1 << 0,
    B = 1 << 1,
    Select = 1 << 2,
    Start = 1 << 3,
    Right = 1 << 4,
    Left = 1 << 5,
    Up = 1 << 6,
    Down = 1 << 7,
    R = 1 << 8,
    L = 1 << 9,
}

export class InputManager {
    static inputs: IInput[] = [
        Keyboard.getInstance(),
        GamepadManager.getInstance(),
    ];

    static initAll(): void {
        for (const input of this.inputs) {
            input.init();
        }
    }

    static startAll(): void {
        for (const input of this.inputs) {
            input.start();
        }
    }

    static removeAll(): void {
        for (const input of this.inputs) {
            input.remove();
        }
    }

    static getKeyCombination(): number {
        let keyCombination = 0;
        for (const input of this.inputs) {
            const keyState = input.getKeyState();
            if (keyState == null) continue;

            for (const key in keyState) {
                if (keyState[key]) {
                    keyCombination |= KeyList[key];
                }
            }
        }
        return keyCombination;
    }
}
