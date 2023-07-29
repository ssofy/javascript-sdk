import {Storage} from "./Storage";

export class CookieStorage implements Storage {
    async put(key: string, value: string, ttl?: number): Promise<void> {
        let expires = "";
        if (ttl) {
            const date = new Date();
            date.setTime(date.getTime() + (ttl * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = key + "=" + (value || "") + expires + "; path=/";
    }

    async get(key: string): Promise<string | null> {
        const nameEQ = key + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    async delete(key: string): Promise<void> {
        document.cookie = key + '=; Max-Age=-99999999;';
    }

    async flushAll(): Promise<void> {
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            const c = ca[i];
            const key = c.split('=')[0].trim();
            this.delete(key);
        }
    }

    async cleanup(): Promise<void> {
        // Not required as cookies in the browser are automatically cleaned up
    }
}
