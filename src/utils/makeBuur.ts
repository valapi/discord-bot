import { Random } from "@ing3kth/core";

interface makeBuurConfig {
    message: string,
    replaceWith?: string,
    percent?: number,
}

function makeBuur(config: makeBuurConfig | string): string {
    if (typeof config === 'string') {
        config = {
            message: config,
        }
    }

    const _defaultSettings: makeBuurConfig = {
        message: '',
        replaceWith: '?',
        percent: 45,
    }
    const _config: makeBuurConfig = new Object({ ..._defaultSettings, ...config }) as makeBuurConfig;

    const split_message = String(_config.message).split('');
    const _buur = [];

    for (let i = 0; i < split_message.length; i++) {
        const _random = Random(0, 100);
        if (_random <= Number(_config.percent)) {
            _buur.push(_config.replaceWith);
        } else {
            _buur.push(split_message[i]);
        }
    }

    return String(_buur.join('')).toUpperCase();
}

export default makeBuur;