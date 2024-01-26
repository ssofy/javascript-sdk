import {BaseError} from "./BaseError";

export class InvalidStateError extends BaseError {
    constructor() {
        super('Invalid State');
        this.name = 'InvalidStateError';
    }
}
