import {BaseError} from "./BaseError";

export class CallbackError extends BaseError {
    public code: string;

    constructor(message: string, code: string) {
        super(message);
        this.code = code;
        this.name = 'CallbackError';
    }
}
