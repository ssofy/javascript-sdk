import {LocalStorage} from "./LocalStorage";

export class SessionStorage extends LocalStorage {
    protected storage = sessionStorage;

    constructor(prefix: string = 'ssofy') {
        super(prefix);
    }
}
