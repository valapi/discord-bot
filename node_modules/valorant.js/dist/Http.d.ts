import { AxiosResponse } from "axios";
import { Request } from "./Request";
export declare abstract class AbstractHttp {
    abstract sendRequest(request: Request): Promise<AxiosResponse>;
}
