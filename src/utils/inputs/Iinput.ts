export interface IInput {
    init(): void;
    start(): void;
    stop(): void;
    remove(): void;
    getKeyState(): { [key: string]: number } | null;
}
