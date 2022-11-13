export enum GamepadKeyType {
    Button,
    Axis,
    AxisDirection,
}

export interface GamePadKey {
    type: GamepadKeyType;
    axis?: number;
    button?: number;
    axisDirection?: number;
}

const GAMEPAD_KEYMAP: { [key: string]: GamePadKey } = {
    A: {
        type: GamepadKeyType.Button,
        button: 0,
    },
    B: {
        type: GamepadKeyType.Button,
        button: 1,
    },
    Select: {
        type: GamepadKeyType.Button,
        button: 8,
    },
    Start: {
        type: GamepadKeyType.Button,
        button: 9,
    },
    Right: {
        type: GamepadKeyType.Button,
        button: 15,
    },
    Left: {
        type: GamepadKeyType.Button,
        button: 14,
    },
    Up: {
        type: GamepadKeyType.Button,
        button: 12,
    },
    Down: {
        type: GamepadKeyType.Button,
        button: 13,
    },
    R: {
        type: GamepadKeyType.Button,
        button: 5,
    },
    L: {
        type: GamepadKeyType.Button,
        button: 4,
    },
};

const GAMEPAD_KEYMAP_XBOX_ONE_S: { [key: string]: GamePadKey } = {
    A: {
        type: GamepadKeyType.Button,
        button: 0,
    },
    B: {
        type: GamepadKeyType.Button,
        button: 1,
    },
    Select: {
        type: GamepadKeyType.Button,
        button: 6,
    },
    Start: {
        type: GamepadKeyType.Button,
        button: 7,
    },
    Right: {
        type: GamepadKeyType.AxisDirection,
        axis: 6,
        axisDirection: 1,
    },
    Left: {
        type: GamepadKeyType.AxisDirection,
        axis: 6,
        axisDirection: -1,
    },
    Up: {
        type: GamepadKeyType.AxisDirection,
        axis: 7,
        axisDirection: -1,
    },
    Down: {
        type: GamepadKeyType.AxisDirection,
        axis: 7,
        axisDirection: 1,
    },
    R: {
        type: GamepadKeyType.Button,
        button: 5,
    },
    L: {
        type: GamepadKeyType.Button,
        button: 4,
    },
};

export class GamepadKeyMapper {
    static getGamepadKeyMap(gamepadId: string): { [key: string]: GamePadKey } {
        if (gamepadId.includes("X-Box One S")) {
            return GAMEPAD_KEYMAP_XBOX_ONE_S;
        }

        return GAMEPAD_KEYMAP;
    }
}
