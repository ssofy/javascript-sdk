export interface Token {
    access_token: string;
    token_type?: 'bearer' | 'mac';
    expires_in?: string;
    refresh_token?: string;
    scope?: string;
    id_token?: string;
    issued_at?: number;
}
