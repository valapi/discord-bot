export function random(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
}

export function arrayRandomIndex<T>(array: Array<T>): number {
    return Math.floor(random(0, array.length - 1));
}