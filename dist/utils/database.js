"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveSchema = exports.ValorantSchema = exports.ValData = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const process = tslib_1.__importStar(require("process"));
const core_1 = require("@ing3kth/core");
const dotenv = tslib_1.__importStar(require("dotenv"));
const _valorantSchema = new mongoose_1.default.Schema({
    account: { type: String, required: true },
    discordId: { type: Number, required: true },
    createdAt: {
        type: Date,
        immutable: true,
        required: false,
        default: () => Date.now(),
        expires: 1296000000,
    },
});
exports.ValorantSchema = _valorantSchema;
const _saveSchema = new mongoose_1.default.Schema({
    user: { type: String, required: true },
    userId: { type: String, required: true },
    guild: { type: String, required: true },
    channelId: { type: String, required: true },
});
exports.SaveSchema = _saveSchema;
class ValData {
    constructor() {
        mongoose_1.default.connection.on("error", ((error) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield core_1.Logs.log(error, 'error');
        })));
        mongoose_1.default.connection.on("connected", (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield core_1.Logs.log('Successfully connected to database', 'system');
        })));
        mongoose_1.default.connection.on("disconnected", (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield core_1.Logs.log('Disconnected from database', 'warning');
        })));
        dotenv.config({
            path: process.cwd() + '/.env'
        });
    }
    login(token = String(process.env['MONGO_TOKEN'])) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!token) {
                yield core_1.Logs.log('token is not defined', 'error');
            }
            yield mongoose_1.default.connect(token);
        });
    }
    getCollection(name, schema) {
        try {
            return mongoose_1.default.model(name, schema);
        }
        catch (error) {
            return mongoose_1.default.model(name);
        }
    }
    static create(token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _database = new ValData();
            yield _database.login(token);
            return _database;
        });
    }
    static checkCollection(config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _MyCollection = (yield ValData.create(config.token)).getCollection(config.name, config.schema);
            const _FindInDatabase = yield _MyCollection.find(config.filter || {});
            return Object.assign({
                isFind: (Number(_FindInDatabase.length) > 0),
                total: Number(_FindInDatabase.length),
                data: _FindInDatabase,
                once: _FindInDatabase[0],
            }, {
                model: _MyCollection
            });
        });
    }
}
exports.ValData = ValData;
