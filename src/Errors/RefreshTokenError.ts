import {BaseError} from "./BaseError";

export class RefreshTokenError extends BaseError {
    constructor() {
        super('Token is not renewable');
    }
}
