import {Storage} from "./Storage";

type StorageItem = {
    value: string;
    expirationDate?: number;
};

export class MemoryStorage implements Storage {
    private store: Map<string, StorageItem> = new Map<string, StorageItem>();

    async put(key: string, value: string, ttl?: number): Promise<void> {
        let expirationDate;
        if (ttl !== undefined) {
            expirationDate = Date.now() + ttl * 1000;
        }
        this.store.set(key, {value, expirationDate});
    }

    async get(key: string): Promise<string | null> {
        const item = this.store.get(key);
        if (item && item.expirationDate !== undefined && Date.now() > item.expirationDate) {
            await this.delete(key);
            return null;
        }
        return item ? item.value : null;
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key);
    }

    async flushAll(): Promise<void> {
        this.store.clear();
    }

    async cleanup(): Promise<void> {
        this.store.forEach((item, key) => {
            if (item.expirationDate !== undefined && Date.now() > item.expirationDate) {
                this.store.delete(key);
            }
        });
    }
}
