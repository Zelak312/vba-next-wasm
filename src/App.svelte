<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
    import { AudioManager } from "./utils/audioManager";
    import { Emulator } from "./utils/emulator";
    import { InputManager } from "./utils/inputManager";

    let wasmStateReady = false;
    let menuIsOpen = false;
    let width = 240;
    let height = 160;
    const aspectRatio = 240 / 160;
    onMount(() => {
        InputManager.initAll();
        onResize();
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

    function onResize() {
        if (window.innerWidth > window.innerHeight) {
            width = window.innerHeight * aspectRatio;
            height = window.innerHeight;
        } else {
            width = window.innerWidth;
            height = window.innerWidth / aspectRatio;
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
            <canvas id="canvas-emu" {width} {height} />
        </div>
    {:else}
        <p>Loading...</p>
    {/if}
</main>

<svelte:window on:keydown={handleKeydown} on:resize={onResize} />

<style>
    .menu {
        position: absolute;
        visibility: hidden;
        height: 100%;
        width: 100%;
    }

    .canvas-wrapper {
        text-align: center;
        height: 100%;
    }

    #canvas-emu {
        image-rendering: pixelated;
        background-color: rebeccapurple;
    }
</style>
