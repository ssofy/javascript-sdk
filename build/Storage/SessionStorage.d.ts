import { LocalStorage } from "./LocalStorage";
export declare class SessionStorage extends LocalStorage {
    protected storage: Storage;
    constructor(prefix?: string);
}
