import { EffectWrapper } from "@babylonjs/core/Materials/effectRenderer";

export function ensureEffectReadyAsync(wrapper: EffectWrapper): Promise<void> {
    if (wrapper.isReady()) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        wrapper.effect.onErrorObservable.add((e) => {
            reject(e);
        });
        wrapper.effect.onCompileObservable.add(() => {
            resolve();
        });
    });
}