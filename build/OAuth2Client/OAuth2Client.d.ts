import { OAuth2Config } from "./OAuth2Config";
import { OAuth2ConfigParameters } from "./OAuth2ConfigParameters";
import { Token } from "./Token";
import { State } from "./State";
export declare class OAuth2Client {
    private config;
    private stateStore;
    constructor(config: OAuth2Config | OAuth2ConfigParameters);
    initAuthCodeFlow(authorizationUrl?: string, nextUri?: string): Promise<State>;
    initImplicitFlow(authorizationUrl?: string, nextUri?: string): Promise<State>;
    handleCallback(payload?: any): Promise<State>;
    getConfig(state: string): Promise<OAuth2Config | null>;
    getUserInfo(state: string): Promise<any>;
    refreshUserInfo(state: string): Promise<any>;
    getAccessToken(state: string): Promise<Token | null>;
    destroy(state: string): Promise<void>;
    private initWorkflow;
    private getState;
    private saveState;
    private deleteState;
    private stateStorageKey;
    private isTokenResponse;
}
