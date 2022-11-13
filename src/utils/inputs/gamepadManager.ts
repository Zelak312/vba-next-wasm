import { KeyList } from "../inputManager";
import {
    GamepadKeyMapper,
    GamepadKeyType,
    type GamePadKey,
} from "./gamepadKeyMapper";
import type { IInput } from "./Iinput";

export interface GameInput {
    gamepad: Gamepad;
    keyMap: { [key: string]: GamePadKey };
}

export class GamepadManager implements IInput {
    private static instance: GamepadManager;
    private gamepads: GameInput[] = [];
    private listening = false;

    static getInstance(): GamepadManager {
        if (!GamepadManager.instance) {
            GamepadManager.instance = new GamepadManager();
        }

        return GamepadManager.instance;
    }

    private onGamepadConnected(e: GamepadEvent): void {
        this.gamepads[e.gamepad.index] = {
            gamepad: e.gamepad,
            keyMap: GamepadKeyMapper.getGamepadKeyMap(e.gamepad.id),
        };
    }

    private onGamepadDisconnected(e: GamepadEvent): void {
        delete this.gamepads[e.gamepad.index];
    }

    init(): void {
        window.addEventListener(
            "gamepadconnected",
            this.onGamepadConnected.bind(this)
        );
        window.addEventListener(
            "gamepaddisconnected",
            this.onGamepadDisconnected.bind(this)
        );
    }

    start(): void {
        this.listening = true;
    }

    stop(): void {
        this.listening = false;
    }

    remove(): void {
        window.removeEventListener(
            "gamepadconnected",
            this.onGamepadConnected.bind(this)
        );
        window.removeEventListener(
            "gamepaddisconnected",
            this.onGamepadDisconnected.bind(this)
        );
    }

    getKeyState(): { [key: string]: number } | null {
        if (!this.listening) return null;

        const keyState: { [key: string]: number } = {};
        for (const key in KeyList) {
            keyState[key] = 0;
        }

        for (let i = this.gamepads.length - 1; i >= 0; i--) {
            const gamepadInput = this.gamepads[i];
            if (!gamepadInput) continue;

            for (const k in gamepadInput.keyMap) {
                const btn = gamepadInput.keyMap[k];
                if (
                    btn.type == GamepadKeyType.Button &&
                    gamepadInput.gamepad.buttons[btn.button].pressed
                ) {
                    keyState[k] = 1;
                } else if (
                    btn.type == GamepadKeyType.AxisDirection &&
                    gamepadInput.gamepad.axes[btn.axis] == btn.axisDirection
                ) {
                    keyState[k] = 1;
                }
            }

            // Axes
            if (gamepadInput.gamepad.axes[0] < -0.5) {
                keyState["Left"] = 1;
            } else if (gamepadInput.gamepad.axes[0] > 0.5) {
                keyState["Right"] = 1;
            }
            if (gamepadInput.gamepad.axes[1] < -0.5) {
                keyState["Up"] = 1;
            } else if (gamepadInput.gamepad.axes[1] > 0.5) {
                keyState["Down"] = 1;
            }
        }

        return keyState;
    }
}
