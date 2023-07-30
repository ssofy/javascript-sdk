import {OAuth2Config} from "./OAuth2Config";
import {OAuth2ConfigParameters} from "./OAuth2ConfigParameters";
import {Storage} from "../Storage/Storage";
import {NullStorage} from "../Storage/NullStorage";
import {ResourceOwnerRequest} from "./ResourceOwnerRequest";
import {AuthorizationRequestHandler} from "./AuthorizationRequestHandler";
import {UserInfoRequestHandler} from "./UserInfoRequestHandler";
import {Token} from "./Token";
import {State} from "./State";
import {InvalidStateError} from "../Errors/InvalidStateError";
import {AuthError} from "../Errors/AuthError";
import {UrlHelper} from "../Helpers/UrlHelper";
import {
    AuthorizationRequest,
    AuthorizationServiceConfiguration,
    AuthorizationRequestJson,
    BaseTokenRequestHandler,
    TokenRequest,
    TokenResponse,
    TokenErrorJson,
    AppAuthError,
    StringMap,
    GRANT_TYPE_AUTHORIZATION_CODE, GRANT_TYPE_REFRESH_TOKEN, DefaultCrypto
} from "@openid/appauth";

function browser(): boolean {
    return typeof process === 'undefined' || !process.release || process.release.name !== 'node';
}

let HttpRequester = require('HttpRequester');
if (!browser()) {
    HttpRequester = HttpRequester.NodeRequestor;
} else {
    HttpRequester = HttpRequester.FetchRequestor;
}

export class OAuth2Client {
    private config: OAuth2Config;

    private stateStore: Storage;

    constructor(config: OAuth2Config | OAuth2ConfigParameters) {
        if (config instanceof OAuth2Config) {
            this.config = config;
        } else {
            this.config = new OAuth2Config(config);
        }

        this.stateStore = config.stateStore ?? new NullStorage();
    }

    async initAuthCodeFlow(nextUri?: string): Promise<State> {
        return this.initWorkflow(AuthorizationRequest.RESPONSE_TYPE_CODE, nextUri);
    }

    async initImplicitFlow(nextUri?: string): Promise<State> {
        return this.initWorkflow(AuthorizationRequest.RESPONSE_TYPE_TOKEN, nextUri);
    }

    async handleCallback(payload: any = {}): Promise<State> {
        const state = payload.state;
        const stateData = await this.getState(state);

        if (!stateData) {
            throw new InvalidStateError();
        }

        const config = new OAuth2Config(stateData.config);

        let extras: StringMap = {};

        let response: TokenResponse | null = null;

        switch (stateData.responseType) {
            case AuthorizationRequest.RESPONSE_TYPE_CODE:
                if (config.pkceVerification && stateData.codeVerifier) {
                    extras['code_verifier'] = stateData.codeVerifier;
                }

                let request: TokenRequest = new TokenRequest({
                    client_id: config.clientId ?? '',
                    redirect_uri: config.redirectUri ?? '',
                    grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
                    code: payload?.code,
                    extras: extras,
                });

                const tokenHandler = new BaseTokenRequestHandler(new HttpRequester());

                try {
                    response = await tokenHandler.performTokenRequest(<AuthorizationServiceConfiguration>{
                        tokenEndpoint: UrlHelper.getUrl(this.config.tokenUrl() ?? ''),
                    }, request);
                } catch (e) {
                    if (e instanceof AppAuthError) {
                        throw new AuthError(e.message);
                    }

                    throw e;
                }

                break;

            case AuthorizationRequest.RESPONSE_TYPE_TOKEN:
                if (!this.isTokenResponse(payload)) {
                    throw new AuthError(payload.error);
                }

                response = new TokenResponse(payload);

                break;
        }

        stateData.token = response?.toJson();

        await this.saveState(state, stateData, this.config.stateTtl);

        return stateData;
    }

    async getConfig(state: string): Promise<OAuth2Config | null> {
        const stateData = await this.getState(state);

        if (!stateData) {
            throw new InvalidStateError();
        }

        if (!stateData.config) {
            return null;
        }

        return new OAuth2Config(stateData.config);
    }

    async getUserInfo(state: string): Promise<any> {
        const stateData = await this.getState(state);

        if (!stateData) {
            throw new InvalidStateError();
        }

        if (!stateData.user) {
            return await this.refreshUserInfo(state);
        }

        return stateData.user;
    }

    async refreshUserInfo(state: string): Promise<any> {
        const stateData = await this.getState(state);

        if (!stateData) {
            throw new InvalidStateError();
        }

        if (!stateData.token) {
            return null;
        }

        const token = await this.getAccessToken(state);

        if (!token) {
            return null;
        }

        const userInfoHandler = new UserInfoRequestHandler(new HttpRequester());

        const user = await userInfoHandler.performUserInfoRequest(<AuthorizationServiceConfiguration>{
            userInfoEndpoint: this.config.resourceOwnerUrl(),
        }, new ResourceOwnerRequest(token.access_token));

        stateData.user = user;

        await this.saveState(state, stateData, this.config.stateTtl);

        return user;
    }

    async getAccessToken(state: string): Promise<Token | null> {
        const stateData = await this.getState(state);

        if (!stateData) {
            throw new InvalidStateError();
        }

        if (!stateData.token) {
            return null;
        }

        const token = stateData.token;

        const expiryTime = (token.issued_at ?? 0) + Number.parseInt(token.expires_in ?? '0');

        if (expiryTime >= Math.floor(Date.now() / 1000)) {
            return token;
        }

        if (!token.refresh_token) {
            return null;
        }

        const config = new OAuth2Config(stateData.config);

        let extras: StringMap = {
            'client_secret': config.clientSecret ?? '',
        };

        if (config.pkceVerification && stateData.codeVerifier) {
            extras['code_verifier'] = stateData.codeVerifier;
        }

        let request: TokenRequest = new TokenRequest({
            client_id: config.clientId ?? '',
            redirect_uri: config.redirectUri ?? '',
            grant_type: GRANT_TYPE_REFRESH_TOKEN,
            refresh_token: token.refresh_token,
            extras: extras,
        });

        const tokenHandler = new BaseTokenRequestHandler(new HttpRequester());

        const response = await tokenHandler.performTokenRequest(<AuthorizationServiceConfiguration>{
            tokenEndpoint: this.config.tokenUrl(),
        }, request);

        stateData.token = response.toJson();

        await this.saveState(state, stateData, this.config.stateTtl);

        return stateData.token;
    }

    public async destroy(state: string): Promise<void> {
        return this.stateStore.delete(this.stateStorageKey(state));
    }

    private async initWorkflow(responseType: string, nextUri?: string): Promise<State> {
        if (browser()) {
            await this.stateStore.cleanup();
        }

        let authorizationUrl = this.config.authorizationUrl() ?? '';

        let extras = UrlHelper.getParameters(authorizationUrl);

        authorizationUrl = UrlHelper.getUrl(authorizationUrl);

        let request;
        while (!request || (await this.stateStore.get(request.state) !== null)) {
            request = new AuthorizationRequest(<AuthorizationRequestJson>{
                client_id: this.config.clientId ?? '',
                redirect_uri: this.config.redirectUri ?? '',
                scope: this.config.scopes?.join(' ') ?? '',
                response_type: responseType,
                extras: extras,
            }, new DefaultCrypto(), this.config.pkceVerification);
        }

        const authorizationHandler = new AuthorizationRequestHandler();

        let stateData: State = {
            state: request.state,
            config: this.config.toJson(),
            responseType: responseType,
            nextUrl: nextUri,
            authorizationUri: ''
        }

        if (this.config.pkceVerification && responseType === AuthorizationRequest.RESPONSE_TYPE_CODE) {
            await request.setupCodeVerifier();
            stateData.codeVerifier = request.internal?.code_verifier;
        }

        stateData.authorizationUri = authorizationHandler.buildRequestUrl(<AuthorizationServiceConfiguration>{
            authorizationEndpoint: authorizationUrl,
        }, request);

        await this.saveState(request.state, stateData, this.config.stateTtl);

        return stateData;
    }

    private async getState(state: string): Promise<State | null> {
        const data = await this.stateStore.get(this.stateStorageKey(state));
        if (!data) {
            return null;
        }

        return JSON.parse(data);
    }

    private async saveState(state: string, data: any, timeout: number = 0): Promise<void> {
        const key = this.stateStorageKey(state);

        await this.stateStore.delete(key);

        await this.stateStore.put(key, JSON.stringify(data), timeout);
    }

    private async deleteState(state: string) {
        await this.stateStore.delete(this.stateStorageKey(state));
    }

    private stateStorageKey(state: string): string {
        return `oauth:state:${state}`;
    }

    private isTokenResponse(response: Token | TokenErrorJson): response is Token {
        return (response as TokenErrorJson).error === undefined;
    }
}
