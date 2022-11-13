<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
    import { AudioManager } from "./utils/audioManager";
    import { Emulator } from "./utils/emulator";
    import { InputManager } from "./utils/inputManager";

    let wasmStateReady = false;
    onMount(() => {
        InputManager.initAll();
    });

    onDestroy(() => {
        InputManager.removeAll();
    });

    function onFileSelected(fileInput: EventTarget) {
        AudioManager.tryInit();
        const file = (fileInput as HTMLInputElement).files[0];
        const fileNameLower = file.name.toLowerCase();
        if (!fileNameLower.endsWith(".gba") || !file) {
            alert("Please select a .gba file.");
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            Emulator.loadRom(file.name, e.target.result as ArrayBuffer);
        };

        fileReader.readAsArrayBuffer(file);
    }

    function onSaveSelected(fileInput: EventTarget) {
        const file = (fileInput as HTMLInputElement).files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            Emulator.loadSave(e.target.result as ArrayBuffer);
        };

        fileReader.readAsArrayBuffer(file);
    }

    // Fix to make wasm know the function
    (window as any).wasmReady = async () => {
        wasmStateReady = true;
        await tick();
        const canvas = document.getElementById(
            "canvas-emu"
        ) as HTMLCanvasElement;
        Emulator.wasmReady(canvas.getContext("2d"));
    };
    (window as any).writeAudio = AudioManager.writeAudio.bind(AudioManager);
</script>

<svelte:head>
    <script src="/44gba.js" async></script>
</svelte:head>

<main>
    {#if wasmStateReady}
        <input type="file" on:change={(e) => onFileSelected(e.target)} />
        <input type="file" on:change={(e) => onSaveSelected(e.target)} />
        <br />
        <canvas id="canvas-emu" width="240" height="160" />
    {:else}
        <p>wasm not ready yet</p>
    {/if}
</main>

<style>
</style>
