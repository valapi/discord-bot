"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const __event = {
    name: 'ready',
    once: true,
    async execute({}, client) {
        IngCore.Logs.log(`Ready! Logged in as ${client.user.tag}`, 'system');
    },
};
exports.default = __event;
