"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const process = __importStar(require("process"));
const core_1 = require("@ing3kth/core");
const _valorantSchema = new mongoose_1.default.Schema({
    account: { type: String, required: true },
    discordId: { type: Number, required: true },
    update: { type: Date, required: false },
});
class ValData {
    constructor() {
        //event
        mongoose_1.default.connection.on("error", ((error) => __awaiter(this, void 0, void 0, function* () {
            yield core_1.Logs.log(error, 'error');
        })));
        mongoose_1.default.connection.on("connected", (() => __awaiter(this, void 0, void 0, function* () {
            yield core_1.Logs.log('Successfully connected to database', 'system');
        })));
        mongoose_1.default.connection.on("disconnected", (() => __awaiter(this, void 0, void 0, function* () {
            yield core_1.Logs.log('Disconnected from database', 'warning');
        })));
    }
    /**
     * login to mongodb database
     * @param {string} token token of access to database
     * @returns {Promise<void>}
     */
    login(token = String(process.env['MONGO_TOKEN'])) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                yield core_1.Logs.log('token is not defined', 'error');
            }
            yield mongoose_1.default.connect(token);
        });
    }
    /**
     * Get {@link mongoose.Model} of the collection
     * @param {string} name name of the collection
     * @returns {mongoose.Model}
     */
    getCollection(name = 'account', schema = _valorantSchema, collection = 'valorant') {
        try {
            return mongoose_1.default.model(name, schema, collection);
        }
        catch (error) {
            return mongoose_1.default.model(name);
        }
    }
    /**
     * Check if collection is exist or not
     * @param {mongoose.Model} model Model of the collection
     * @param {mongoose.FilterQuery} filter filter to check
     * @returns {Promise<number>}
     */
    static checkIfExist(model, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const _FindInDatabase = yield model.find(filter);
            return {
                isFind: (Number(_FindInDatabase.length) > 0),
                total: Number(_FindInDatabase.length),
                data: _FindInDatabase,
                once: _FindInDatabase[0],
            };
        });
    }
    /**
     * login to mongodb database
     * @param {string} token token of access to database
     * @returns {Promise<ValData>}
     */
    static verify(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const _database = new ValData();
            _database.login(token);
            return _database;
        });
    }
}
exports.ValData = ValData;
//# sourceMappingURL=database.js.map