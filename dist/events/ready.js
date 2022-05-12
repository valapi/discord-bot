"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@ing3kth/core");
exports.default = {
    name: 'ready',
    once: true,
    execute(client) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield core_1.Logs.log(`Ready! Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} ${(_b = client.user) === null || _b === void 0 ? void 0 : _b.tag}`, 'info');
        });
    },
};
//# sourceMappingURL=ready.js.map