import { AxiosError, AxiosResponse } from "axios";
export declare class ApiClientException {
    error: AxiosError;
    response: AxiosResponse;
    data: IRiotException;
    constructor(error: AxiosError);
}
export interface IRiotException {
    httpStatus: number;
    errorCode: string;
    message: string;
}
export declare class InvalidCredsException extends Error {
    username: string;
    constructor(username: string, message?: string);
}
