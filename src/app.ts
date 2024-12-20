import { Renderer } from "./renderer";

// Find our elements
const mainCanvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const headerTitle = document.getElementById("headerTitle") as HTMLCanvasElement;

// Texture tools current state.
const maskURL = "./assets/mask.webp";
//const maskURL = "./assets/largeMask.png";

const renderer = new Renderer(mainCanvas, maskURL);
(async () => {
    await renderer.ensureReadyAsync();

    headerTitle.innerText = "Loaded";

    renderer.startRender();
})();