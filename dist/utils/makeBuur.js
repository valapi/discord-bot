"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@ing3kth/core");
function makeBuur(message, replaceWithString = '?') {
    const split_message = String(message).split('');
    const _buur = [];
    for (let i = 0; i < split_message.length; i++) {
        const _random = (0, core_1.Random)(0, 100);
        if (_random <= 45) {
            _buur.push(replaceWithString);
        }
        else {
            _buur.push(split_message[i]);
        }
    }
    return String(_buur.join('')).toUpperCase();
}
exports.default = makeBuur;
//# sourceMappingURL=makeBuur.js.map