import { type MainEffect } from "./effects/mainEffect";

export class Renderer {
    private readonly _context: WebGL2RenderingContext;
    private readonly _maskImage: HTMLImageElement;

    private _mainEffect?: MainEffect;

    constructor(canvas: HTMLCanvasElement, maskImageUrl: string) {
        this._context = canvas.getContext("webgl2", {
            preserveDrawingBuffer: false,
            antialias: false,
            alpha: true,
            depth: true,
            stencil: true,
        }) as WebGL2RenderingContext;

        this._maskImage = document.createElement("img");
        this._maskImage.src = maskImageUrl;
        this._maskImage.loading = "eager"
        this._maskImage.decode();
    }

    public async ensureReadyAsync() {
        if (this._mainEffect) {
            return;
        }

        // Loads the shaders and babylonjs in parallel.
        const shaderLoaderPromise = import(/* webpackChunkName: "shaderLoader" */"./effects/shaderLoader");
        const mainEffectPromise = import(/* webpackChunkName: "mainEffect" */"./effects/mainEffect");

        // Start shader cimpilation while compiling the shaders.
        const shaderLoaderModule = await shaderLoaderPromise;
        await shaderLoaderModule.loadShadersAsync(this._context);

        // Once Babylon is loaded, we can start loading the main effect.
        const visualEffectModule = await mainEffectPromise;
        this._mainEffect = new visualEffectModule.MainEffect(this._context, this._maskImage);

        // Wait for all to be ready.
        await this._mainEffect.ensureReadyAsync();
    }

    public startRender(): void {
        if (!this._mainEffect) {
            return;
        }
        this._mainEffect.startRender();
    }

    dispose() {
        if (!this._mainEffect) {
            return;
        }
        this._mainEffect.dispose();
    }
}