import { OAuth2ConfigParameters } from "./OAuth2ConfigParameters";
import { Storage } from "../Storage/Storage";
export declare class OAuth2Config implements OAuth2ConfigParameters {
    url?: string;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    pkceVerification?: boolean;
    timeout?: number;
    scopes?: string[];
    locale?: string;
    state?: string;
    stateStore?: Storage;
    stateTtl?: number;
    constructor(params: OAuth2ConfigParameters);
    authorizationUrl(token?: string): string | null;
    socialAuthorizationUrl(provider: string): string | null;
    tokenUrl(): string | null;
    logoutUrl(): string | null;
    logoutEverywhereUrl(): string | null;
    registrationUrl(): string | null;
    profileUrl(): string | null;
    resourceOwnerUrl(): string | null;
    toJson(): any;
    private addUrlParams;
    private urlJoin;
}
