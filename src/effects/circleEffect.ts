import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { EffectWrapper, EffectRenderer } from "@babylonjs/core/Materials/effectRenderer";
import { ThinRenderTargetTexture } from "@babylonjs/core/Materials/Textures/thinRenderTargetTexture";
import "@babylonjs/core/Engines/Extensions/engine.renderTarget";

import { ensureEffectReadyAsync } from "../utils/effectUtils";

export class CircleEffect {
    private readonly _renderer: EffectRenderer;
    private readonly _circleEffect: EffectWrapper;
    public readonly circleTexture: ThinRenderTargetTexture;

    constructor(engine: ThinEngine, renderer: EffectRenderer) {
        this._renderer = renderer;
        this._circleEffect = new EffectWrapper({
            name: "Circle",
            engine: engine,
            useShaderStore: true,
            fragmentShader: "circle",
            uniformNames: ["radius"],
        });
        this.circleTexture = new ThinRenderTargetTexture(engine, 512, {
            generateMipMaps: false,
            generateDepthBuffer: false,
            generateStencilBuffer: false,
        });
    }

    public isReady(): boolean {
        return this._circleEffect.isReady();
    }

    public ensureReadyAsync(): Promise<void> {
        return ensureEffectReadyAsync(this._circleEffect);
    }

    public render(): boolean {
        if (!this.isReady()) {
            return false;
        }

        const out = this.circleTexture.renderTarget!;
        this._renderer.engine.bindFramebuffer(out);

        this._renderer.engine.enableEffect(this._circleEffect.drawWrapper);
        this._renderer.bindBuffers(this._circleEffect.effect);

        const normalizedRadius = Math.sin(performance.now() * 0.001) * 0.5 + 0.5;

        this._circleEffect.effect.setFloat2("scale", 1, 1);
        this._circleEffect.effect.setFloat("radius", 0.2 * normalizedRadius);

        this._renderer.draw();

        this._renderer.engine.unBindFramebuffer(out);

        return true;
    }

    public dispose(): void {
        this._circleEffect.dispose();
        this.circleTexture.dispose();
    }
}