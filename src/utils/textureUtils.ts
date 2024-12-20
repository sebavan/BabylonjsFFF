export function ensureImageElementLoadedAsync(image: HTMLImageElement): Promise<void> {
    if (image.complete) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        image.onload = () => {
            resolve();
        };
        image.onerror = (e) => {
            reject(e);
        };
    });
}