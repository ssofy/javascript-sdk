import {BaseError} from "./BaseError";

export class AuthError extends BaseError {
    constructor(public message: string) {
        super(`Error: ${message}`);
    }
}
