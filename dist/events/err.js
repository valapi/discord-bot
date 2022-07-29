"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const __event = {
    name: "error",
    once: false,
    async execute({}, error) {
        IngCore.Logs.log(error, "error");
    },
};
exports.default = __event;
