import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { EffectRenderer } from "@babylonjs/core/Materials/effectRenderer";
import { MaskEffect } from "./maskEffect";
import { CircleEffect } from "./circleEffect";
import { ThinTexture } from "@babylonjs/core/Materials/Textures/thinTexture";
import { PerfCounter } from "@babylonjs/core/Misc/perfCounter";
import "@babylonjs/core/Engines/Extensions/engine.query";

import { ensureImageElementLoadedAsync } from "../utils/textureUtils";

export class MainEffect {
    private readonly _maskImage: HTMLImageElement;
    
    private readonly _engine: ThinEngine;
    private readonly _maskEffect: MaskEffect;
    private readonly _circleEffect: CircleEffect;
    private readonly _maskTexture: ThinTexture;
    private readonly _stats: PerfCounter;

    constructor(context: WebGL2RenderingContext, maskImage: HTMLImageElement) {
        this._engine = new ThinEngine(context, false, { 
            doNotHandleContextLost: true,
            depth: false,
            stencil: false,
        });

        this._maskImage = maskImage;

        const renderer = new EffectRenderer(this._engine);
        this._maskEffect = new MaskEffect(this._engine, renderer);
        this._circleEffect = new CircleEffect(this._engine, renderer);
        this._maskTexture = new ThinTexture(null);
        this._maskTexture.wrapU = 2;
        this._maskTexture.wrapV = 2;

        this._engine.captureGPUFrameTime(true);
        this._stats = this._engine.getGPUFrameTimeCounter()!;
    }

    public async ensureReadyAsync(): Promise<void> {
        const promises = [];

        promises.push(this._maskEffect.ensureReadyAsync());
        promises.push(this._circleEffect.ensureReadyAsync());
        promises.push(this._initializeMaskTextureAsync());

        return Promise.all(promises) as unknown as Promise<void>;
    }

    public startRender(): void {
        this._engine.preventCacheWipeBetweenFrames = true;
        this._engine.setState(true);
        this._engine.depthCullingState.depthTest = false;
        this._engine.stencilState.stencilTest = false;

        this._engine.runRenderLoop(() => {
            this._circleEffect.render();
            this._maskEffect.render(this._maskTexture, this._circleEffect.circleTexture);
        });

        setInterval(() => {
            console.log("gpu time", this._stats.lastSecAverage, "ns");
        }, 1000);
    }

    dispose() {
        this._engine.dispose();
        this._maskEffect.dispose();
        this._circleEffect.dispose();
    }

    private async _initializeMaskTextureAsync(): Promise<void> {
        await ensureImageElementLoadedAsync(this._maskImage);

        const internalTexture = this._engine.createTexture(null, true, false, null, undefined, undefined, undefined, this._maskImage);
        this._maskTexture._texture = internalTexture;
    }
}