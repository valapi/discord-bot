"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const process = tslib_1.__importStar(require("process"));
const fs = tslib_1.__importStar(require("fs"));
exports.default = {
    name: 'modalSubmit',
    once: true,
    execute(modal, _extraData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ModalFolder = yield fs.readdirSync(`${process.cwd()}/dist/commands/modal`).filter(file => file.endsWith('.js'));
            ModalFolder.forEach((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const _file = require(`${process.cwd()}/dist/commands/modal/${file.replace('.js', '')}`).default;
                if (_file.customId === modal.customId) {
                    yield _file.execute(modal, _extraData);
                    return;
                }
            }));
        });
    },
};
