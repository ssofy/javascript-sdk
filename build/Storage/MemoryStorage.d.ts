import { Storage } from "./Storage";
export declare class MemoryStorage implements Storage {
    private store;
    put(key: string, value: string, ttl?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    delete(key: string): Promise<void>;
    flushAll(): Promise<void>;
    cleanup(): Promise<void>;
}
