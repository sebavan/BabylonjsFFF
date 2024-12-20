import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { EffectWrapper, EffectRenderer } from "@babylonjs/core/Materials/effectRenderer";
import { ThinTexture } from "@babylonjs/core/Materials/Textures/thinTexture";

import { ensureEffectReadyAsync } from "../utils/effectUtils";

export class MaskEffect {
    private readonly _renderer: EffectRenderer;
    private readonly _maskEffect: EffectWrapper;

    constructor(engine: ThinEngine, renderer: EffectRenderer) {
        this._renderer = renderer;
        this._maskEffect = new EffectWrapper({
            name: "Mask",
            engine: engine,
            useShaderStore: true,
            fragmentShader: "mask",
            uniformNames: ["rotation"],
            samplerNames: ["maskSampler", "circleSampler"],
        });
    }

    public isReady(): boolean {
        return this._maskEffect.isReady();
    }

    public ensureReadyAsync(): Promise<void> {
        return ensureEffectReadyAsync(this._maskEffect);
    }

    public render(maskTexture: ThinTexture, circleTexture: ThinTexture): boolean {
        if (!this.isReady()) {
            return false;
        }

        this._renderer.setViewport();
        this._renderer.engine.enableEffect(this._maskEffect.drawWrapper);

        const rotation = -performance.now() * 0.0002;

        this._maskEffect.effect.setFloat2("scale", 1, 1);
        this._maskEffect.effect.setFloat("rotation", rotation);
        this._maskEffect.effect.setTexture("maskSampler", maskTexture);
        this._maskEffect.effect.setTexture("circleSampler", circleTexture);

        this._renderer.draw();

        return true;
    }

    public dispose(): void {
        this._maskEffect.dispose();
    }
}