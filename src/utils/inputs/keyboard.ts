import { KeyList } from "../inputManager";
import type { IInput } from "./Iinput";

export class Keyboard implements IInput {
    private static instance: Keyboard;
    private keyState: { [key: string]: number } = {};
    private listening = false;

    static getInstance(): Keyboard {
        if (!Keyboard.instance) {
            Keyboard.instance = new Keyboard();
        }

        return Keyboard.instance;
    }

    private matchKey(key: string): string {
        switch (key) {
            case "ArrowLeft":
                return KeyList[KeyList.Left];
            case "ArrowRight":
                return KeyList[KeyList.Right];
            case "ArrowUp":
                return KeyList[KeyList.Up];
            case "ArrowDown":
                return KeyList[KeyList.Down];
            case "x":
                return KeyList[KeyList.A];
            case "z":
                return KeyList[KeyList.B];
            case "s":
                return KeyList[KeyList.Select];
            case "Enter":
                return KeyList[KeyList.Start];
            case "r":
                return KeyList[KeyList.R];
            case "l":
                return KeyList[KeyList.L];
            default:
                return null;
        }
    }

    init(): void {
        for (const key in KeyList) {
            this.keyState[key] = 0;
        }

        document.onkeydown = (e) => {
            if (!this.listening) return;
            this.addRemoveKey(e);
        };

        document.onkeyup = (e) => {
            if (!this.listening) return;
            this.addRemoveKey(e, true);
        };
    }

    addRemoveKey(e: KeyboardEvent, remove = false): void {
        const key = this.matchKey(e.key);
        if (!key) return;
        if (!remove) {
            this.keyState[key] = 1;
        } else {
            this.keyState[key] = 0;
        }
    }

    start(): void {
        this.listening = true;
    }

    stop(): void {
        this.listening = false;
    }

    remove(): void {
        document.onkeydown = null;
        document.onkeyup = null;
    }

    getKeyState(): { [key: string]: number } | null {
        if (!this.listening) return null;
        return this.keyState;
    }
}
