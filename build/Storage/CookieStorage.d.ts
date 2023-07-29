import { Storage } from "./Storage";
export declare class CookieStorage implements Storage {
    put(key: string, value: string, ttl?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    delete(key: string): Promise<void>;
    flushAll(): Promise<void>;
    cleanup(): Promise<void>;
}
