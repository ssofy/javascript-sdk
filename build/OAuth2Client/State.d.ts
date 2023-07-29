import { OAuth2ConfigParameters } from "./OAuth2ConfigParameters";
import { Token } from "./Token";
export interface State {
    state: string;
    config: OAuth2ConfigParameters;
    responseType: string;
    nextUrl?: string;
    codeVerifier?: string;
    token?: Token;
    user?: any;
    authorizationUri: string;
}
