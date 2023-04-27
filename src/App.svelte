<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
    import { AudioManager } from "./utils/audioManager";
    import { Emulator } from "./utils/emulator";
    import { InputManager } from "./utils/inputManager";

    let wasmStateReady = false;
    let menuIsOpen = false;
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

    // TODO: Fix to make wasm know the function
    (window as any).wasmReady = async () => {
        wasmStateReady = true;
        await tick();
        const canvas = document.getElementById(
            "canvas-emu"
        ) as HTMLCanvasElement;
        Emulator.wasmReady(canvas.getContext("2d"));
    };
    (window as any).writeAudio = AudioManager.writeAudio.bind(AudioManager);

    function handleKeydown(e: KeyboardEvent) {
        if (e.key == "Escape") {
            menuIsOpen = !menuIsOpen;
        }
    }
</script>

<svelte:head>
    <script src="/vba-wsm.js" async></script>
</svelte:head>

<main>
    {#if wasmStateReady}
        <div class="menu" style:visibility={menuIsOpen ? "visible" : "hidden"}>
            <input type="file" on:change={(e) => onFileSelected(e.target)} />
            <input type="file" on:change={(e) => onSaveSelected(e.target)} />
        </div>
        <div class="canvas-wrapper">
            <canvas id="canvas-emu" width="240" height="160" />
        </div>
    {:else}
        <p>Loading...</p>
    {/if}
</main>

<svelte:window on:keydown={handleKeydown} />

<style>
    .menu {
        position: absolute;
        visibility: hidden;
        height: 100%;
        width: 100%;
    }

    .canvas-wrapper {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #canvas-emu {
        image-rendering: pixelated;
        width: 100%;
        height: 100%;
    }
</style>
