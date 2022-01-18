"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredsException = exports.ApiClientException = void 0;
class ApiClientException {
    constructor(error) {
        this.error = error;
        this.response = error.response;
        this.data = error.response.data;
    }
}
exports.ApiClientException = ApiClientException;
class InvalidCredsException extends Error {
    constructor(username, message) {
        super(message);
        this.username = username;
    }
}
exports.InvalidCredsException = InvalidCredsException;
//# sourceMappingURL=Exceptions.js.map