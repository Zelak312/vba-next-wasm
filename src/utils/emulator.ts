import { InputManager } from "./inputManager";

const wasmSaveBufLen = 0x20000 + 0x2000;

export class Emulator {
    private static isRunning = false;
    private static drawContext: CanvasRenderingContext2D;
    private static romBufferPtr = -1;
    private static wasmSaveBuf: Uint8Array;
    private static imageData: ImageData;
    private static gameID: string;
    private static frameCnt = 0;
    private static last128FrameTime = 0;

    static getIsRunning(): boolean {
        return this.isRunning;
    }

    static getWasmSaveBuf(): Uint8Array {
        return this.wasmSaveBuf;
    }

    static wasmReady(drawContext: CanvasRenderingContext2D): void {
        this.drawContext = drawContext;
        this.romBufferPtr = Module._emuGetSymbol(1);
        let ptr = Module._emuGetSymbol(2);

        this.wasmSaveBuf = Module.HEAPU8.subarray(ptr, ptr + wasmSaveBufLen);
        ptr = Module._emuGetSymbol(3);
        this.imageData = new ImageData(
            new Uint8ClampedArray(Module.HEAPU8.buffer).subarray(
                ptr,
                ptr + 240 * 160 * 4
            ),
            240,
            160
        );
    }

    static emuLoop() {
        window.requestAnimationFrame(this.emuLoop.bind(this));
        this.runFrame();
    }

    static runFrame(): void {
        if (this.isRunning) {
            this.frameCnt++;
            if (this.frameCnt % 60 == 0) {
                // checkSaveBufState(); For auto saving
            }
            if (this.frameCnt % 128 == 0) {
                if (this.last128FrameTime) {
                    const diff = performance.now() - this.last128FrameTime;
                    const frameInMs = diff / 128;
                    let fps = -1;
                    if (frameInMs > 0.001) {
                        fps = 1000 / frameInMs;
                    }
                    console.log("fps", fps);
                }
                this.last128FrameTime = performance.now();
            }

            Module._emuRunFrame(InputManager.getKeyCombination());
            this.drawContext.putImageData(this.imageData, 0, 0);
        }
    }

    static loadRom(fileName: string, arrayBuffer: ArrayBuffer): void {
        this.isRunning = false;
        const u8 = new Uint8Array(arrayBuffer);
        this.gameID = "";
        if (u8[0xb2] != 0x96) {
            alert("Not a valid GBA ROM!");
            return;
        }

        for (var i = 0xac; i < 0xb2; i++) {
            this.gameID += String.fromCharCode(u8[i]);
        }

        if (u8[0xac] == 0 || this.gameID.substr(0, 4) == "0000") {
            // a homebrew! use file name as id
            this.gameID = fileName;
        }

        console.log("gameID", this.gameID);
        Module.HEAPU8.set(u8, this.romBufferPtr);
        Module._emuLoadROM(u8.length);
        Module._emuResetCpu();
        this.isRunning = true;

        InputManager.startAll();
        this.emuLoop();
    }

    static loadSave(arrayBuffer: ArrayBuffer): void {
        this.wasmSaveBuf.set(new Uint8Array(arrayBuffer));
        Module._emuResetCpu();
    }
}
