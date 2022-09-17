"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const app_1 = require("./app");
const PORT = IngCore.Random(3000, 4000);
const app = (0, express_1.default)();
app.get("/", ((req, res, next) => {
    res.send(JSON.stringify({
        uptime: IngCore.ToMilliseconds(process.uptime() * 1000),
    }));
}));
app.listen(PORT, (() => {
    IngCore.Logs.log(`Server is running on PORT ${PORT}`);
}));
(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const _DevelopmentMode = false;
    yield (0, app_1.StartDiscordBot)(_DevelopmentMode);
}))();
