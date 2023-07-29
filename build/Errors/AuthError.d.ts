import { BaseError } from "./BaseError";
export declare class AuthError extends BaseError {
    message: string;
    constructor(message: string);
}
