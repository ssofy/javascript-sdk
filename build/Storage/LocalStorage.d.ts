import { Storage } from "./Storage";
export declare class LocalStorage implements Storage {
    private readonly prefix;
    private readonly ttlSuffix;
    constructor(prefix?: string);
    put(key: string, value: string, ttl?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    delete(key: string): Promise<void>;
    flushAll(): Promise<void>;
    cleanup(): Promise<void>;
    private prefixedKey;
    private ttlKey;
}
