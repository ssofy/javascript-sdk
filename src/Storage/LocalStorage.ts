import {Storage} from "./Storage";

export class LocalStorage implements Storage {
    private readonly prefix: string;
    private readonly ttlSuffix: string;

    constructor(prefix: string = 'ssofy') {
        this.prefix = `${prefix}_`;
        this.ttlSuffix = '_ttl';
    }

    async put(key: string, value: string, ttl?: number): Promise<void> {
        localStorage.setItem(this.prefixedKey(key), value);
        if (ttl !== undefined) {
            const expirationDate = Date.now() + ttl * 1000;
            localStorage.setItem(this.ttlKey(key), String(expirationDate));
        }
    }

    async get(key: string): Promise<string | null> {
        const expirationDate = localStorage.getItem(this.ttlKey(key));
        if (expirationDate !== null && Date.now() > Number(expirationDate)) {
            await this.delete(key);
            return null;
        }
        return localStorage.getItem(this.prefixedKey(key));
    }

    async delete(key: string): Promise<void> {
        localStorage.removeItem(this.prefixedKey(key));
        localStorage.removeItem(this.ttlKey(key));
    }

    async flushAll(): Promise<void> {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key !== null && key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        }
    }

    async cleanup(): Promise<void> {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
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
