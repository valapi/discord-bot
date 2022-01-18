import { AxiosRequestConfig, Method } from "axios";
import { CookieJar } from "tough-cookie";
export declare class RequestBuilder {
    private _headers;
    private _body?;
    private _url;
    private _method;
    private _jar;
    static fromRequest(request: Request): RequestBuilder;
    setUrl(url: string): RequestBuilder;
    setBody(body: any): RequestBuilder;
    setMethod(method: Method): RequestBuilder;
    addHeader(key: string, value: string): RequestBuilder;
    setCookieJar(jar: CookieJar): this;
    build(): Request;
}
export declare class Request implements AxiosRequestConfig {
    url: string;
    method: Method;
    headers: any;
    data?: any;
    jar?: any;
    withCredentials: boolean;
    constructor(url: string, method: Method, headers: any, body?: any, jar?: any);
}
