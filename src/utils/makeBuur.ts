import { Random } from "@ing3kth/core";

function makeBuur(message: string, replaceWithString:string= '?'): string {
    const split_message = String(message).split('');
    const _buur = [];

    for (let i = 0; i < split_message.length; i++) {
        const _random = Random(0, 100);
        if (_random <= 45) {
            _buur.push(replaceWithString);
        } else {
            _buur.push(split_message[i]);
        }
    }

    return String(_buur.join('')).toUpperCase();
}

export default makeBuur;