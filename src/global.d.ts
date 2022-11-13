interface Module {
    _emuRunAudio(): void;
    _emuRunFrame(key: number): void;
    _emuUpdateSavChangeFlag(): number;
    _emuSetSampleRate(sampleRate: number): void;
    _emuLoadROM(romSize: number): number;
    _emuResetCpu(): void;
    _emuGetSymbol(symbol: number): number;
    _emuAddCheat(ptrGBuf: Uint8Array): number;
    _readU32(addr: number): number;
    _writeU32(address: number, value: number): void;
    HEAPU8: Uint8Array;
}

export declare global {
    let Module: Module;
}
