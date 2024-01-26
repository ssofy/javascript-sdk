import { BaseError } from "./BaseError";
export declare class CallbackError extends BaseError {
    code: string;
    constructor(message: string, code: string);
}
