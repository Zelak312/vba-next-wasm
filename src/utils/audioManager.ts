import { Emulator } from "./emulator";

const AUDIO_BLOCK_SIZE = 1024;
const AUDIO_FIFO_MAXLEN = 4900;

export class AudioManager {
    private static audioBuf: Int16Array;
    private static context: globalThis.AudioContext;
    private static fifo0: Int16Array = new Int16Array(AUDIO_FIFO_MAXLEN);
    private static fifo1: Int16Array = new Int16Array(AUDIO_FIFO_MAXLEN);
    private static fifoHead = 0;
    private static fifoCnt = 0;

    static tryInit(): void {
        if (this.context) {
            if (this.context.state != "running") {
                this.context.resume();
            }

            return;
        }

        try {
            this.context = new (window.AudioContext ||
                (window as any).webkitAudioContext)({
                latencyHint: 0.0001,
                sampleRate: 50000,
            });

            const scriptProcessor = this.context.createScriptProcessor(
                AUDIO_BLOCK_SIZE,
                0,
                2
            );

            scriptProcessor.onaudioprocess = this.processAudio.bind(this);
            scriptProcessor.connect(this.context.destination);
            this.context.resume();
        } catch (e) {
            console.log(e);
        }
    }

    static processAudio(event): void {
        const outputBuffer = event.outputBuffer;
        const audioData0 = outputBuffer.getChannelData(0);
        const audioData1 = outputBuffer.getChannelData(1);

        if (!Emulator.getIsRunning() /*|| turboMode*/) {
            // TODO: use turbo mode from emulator
            for (var i = 0; i < AUDIO_BLOCK_SIZE; i++) {
                audioData0[i] = 0;
                audioData1[i] = 0;
            }
            return;
        }

        while (this.fifoCnt < AUDIO_BLOCK_SIZE) {
            Emulator.runFrame();
        }

        var copySize = AUDIO_BLOCK_SIZE;
        if (this.fifoCnt < copySize) {
            copySize = this.fifoCnt;
        }
        for (var i = 0; i < copySize; i++) {
            audioData0[i] = this.fifo0[this.fifoHead] / 32768.0;
            audioData1[i] = this.fifo1[this.fifoHead] / 32768.0;
            this.fifoHead = (this.fifoHead + 1) % AUDIO_FIFO_MAXLEN;
            this.fifoCnt--;
        }
    }

    static writeAudio(ptr, frames): void {
        // if (turboMode) {
        //     return;
        // }
        // TODO: use turbo mode from emulator

        if (!this.audioBuf) {
            this.audioBuf = new Int16Array(Module.HEAPU8.buffer).subarray(
                ptr / 2,
                ptr / 2 + 2048
            );
        }

        let tail = (this.fifoHead + this.fifoCnt) % AUDIO_FIFO_MAXLEN;
        if (this.fifoCnt + frames >= AUDIO_FIFO_MAXLEN) {
            return;
        }

        for (let i = 0; i < frames; i++) {
            this.fifo0[tail] = this.audioBuf[i * 2];
            this.fifo1[tail] = this.audioBuf[i * 2 + 1];
            tail = (tail + 1) % AUDIO_FIFO_MAXLEN;
        }

        this.fifoCnt += frames;
    }
}
