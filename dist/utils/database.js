"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValorInterface = exports.ValorDatabase = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const process = tslib_1.__importStar(require("process"));
var ValorInterface;
(function (ValorInterface) {
    let Account;
    (function (Account) {
        Account.Schema = new mongoose_1.default.Schema({
            account: { type: String, required: true },
            region: { type: String, required: true },
            discordId: { type: Number, required: true },
            createdAt: {
                type: Date,
                immutable: true,
                required: false,
                default: () => Date.now(),
                expires: 1296000000,
            },
        });
    })(Account = ValorInterface.Account || (ValorInterface.Account = {}));
    let Daily;
    (function (Daily) {
        Daily.Schema = new mongoose_1.default.Schema({
            user: { type: String, required: true },
            userId: { type: String, required: true },
            guild: { type: String, required: true },
            channelId: { type: String, required: true },
        });
    })(Daily = ValorInterface.Daily || (ValorInterface.Daily = {}));
})(ValorInterface || (ValorInterface = {}));
exports.ValorInterface = ValorInterface;
function ValorDatabase(config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!config.token) {
            if (process.env['MONGO_TOKEN']) {
                config.token = process.env['MONGO_TOKEN'];
            }
            else {
                throw new Error('token is undefined');
            }
        }
        yield mongoose_1.default.connect(config.token);
        let MyModel;
        try {
            MyModel = mongoose_1.default.model(config.name, config.schema);
        }
        catch (error) {
            MyModel = mongoose_1.default.model(config.name);
        }
        const MyData = yield MyModel.find(config.filter || {});
        return {
            isFind: MyData.length > 0,
            data: MyData,
            model: MyModel,
        };
    });
}
exports.ValorDatabase = ValorDatabase;
