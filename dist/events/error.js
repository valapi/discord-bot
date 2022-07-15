"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@ing3kth/core");
exports.default = {
    name: 'error',
    once: false,
    execute(error) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield core_1.Logs.log(error, 'error');
        });
    },
};
