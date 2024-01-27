import {Storage} from "./Storage";

export class LocalStorage implements Storage {
    protected storage = localStorage;

    private readonly prefix: string;
    private readonly ttlSuffix: string;

    constructor(prefix: string = 'ssofy') {
        this.prefix = `${prefix}_`;
        this.ttlSuffix = '_ttl';
    }

    async put(key: string, value: string, ttl?: number): Promise<void> {
        this.storage.setItem(this.prefixedKey(key), value);
        if (ttl !== undefined) {
            const expirationDate = Date.now() + ttl * 1000;
            this.storage.setItem(this.ttlKey(key), String(expirationDate));
        }
    }

    async get(key: string): Promise<string | null> {
        const expirationDate = this.storage.getItem(this.ttlKey(key));
        if (expirationDate !== null && Date.now() > Number(expirationDate)) {
            await this.delete(key);
            return null;
        }
        return this.storage.getItem(this.prefixedKey(key));
    }

    async delete(key: string): Promise<void> {
        this.storage.removeItem(this.prefixedKey(key));
        this.storage.removeItem(this.ttlKey(key));
    }

    async flushAll(): Promise<void> {
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key !== null && key.startsWith(this.prefix)) {
                this.storage.removeItem(key);
            }
        }
    }

    async cleanup(): Promise<void> {
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key !== null && key.startsWith(this.prefix)) {
                await this.get(key.replace(this.prefix, '').replace(this.ttlSuffix, ''));
            }
        }
    }

    private prefixedKey(key: string): string {
        return this.prefix + key;
    }

    private ttlKey(key: string): string {
        return this.prefixedKey(key) + this.ttlSuffix;
    }
}
