"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Client = void 0;
var OAuth2Config_1 = require("./OAuth2Config");
var NullStorage_1 = require("../Storage/NullStorage");
var ResourceOwnerRequest_1 = require("./ResourceOwnerRequest");
var AuthorizationRequestHandler_1 = require("./AuthorizationRequestHandler");
var UserInfoRequestHandler_1 = require("./UserInfoRequestHandler");
var InvalidStateError_1 = require("../Errors/InvalidStateError");
var AuthError_1 = require("../Errors/AuthError");
var UrlHelper_1 = require("../Helpers/UrlHelper");
var appauth_1 = require("@openid/appauth");
function browser() {
    return typeof process === 'undefined' || !process.release || process.release.name !== 'node';
}
var HttpRequester = require('HttpRequester');
if (!browser()) {
    HttpRequester = HttpRequester.NodeRequestor;
}
else {
    HttpRequester = HttpRequester.FetchRequestor;
}
var OAuth2Client = /** @class */ (function () {
    function OAuth2Client(config) {
        var _a;
        if (config instanceof OAuth2Config_1.OAuth2Config) {
            this.config = config;
        }
        else {
            this.config = new OAuth2Config_1.OAuth2Config(config);
        }
        this.stateStore = (_a = config.stateStore) !== null && _a !== void 0 ? _a : new NullStorage_1.NullStorage();
    }
    OAuth2Client.prototype.initAuthCodeFlow = function (nextUri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.initWorkflow(appauth_1.AuthorizationRequest.RESPONSE_TYPE_CODE, nextUri)];
            });
        });
    };
    OAuth2Client.prototype.initImplicitFlow = function (nextUri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.initWorkflow(appauth_1.AuthorizationRequest.RESPONSE_TYPE_TOKEN, nextUri)];
            });
        });
    };
    OAuth2Client.prototype.handleCallback = function (state, payload) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var stateData, config, extras, response, _d, request, tokenHandler, e_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.getState(state)];
                    case 1:
                        stateData = _e.sent();
                        if (!stateData) {
                            throw new InvalidStateError_1.InvalidStateError();
                        }
                        config = new OAuth2Config_1.OAuth2Config(stateData.config);
                        extras = {};
                        response = null;
                        _d = stateData.responseType;
                        switch (_d) {
                            case appauth_1.AuthorizationRequest.RESPONSE_TYPE_CODE: return [3 /*break*/, 2];
                            case appauth_1.AuthorizationRequest.RESPONSE_TYPE_TOKEN: return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 8];
                    case 2:
                        if (config.pkceVerification && stateData.codeVerifier) {
                            extras['code_verifier'] = stateData.codeVerifier;
                        }
                        request = new appauth_1.TokenRequest({
                            client_id: (_a = config.clientId) !== null && _a !== void 0 ? _a : '',
                            redirect_uri: (_b = config.redirectUri) !== null && _b !== void 0 ? _b : '',
                            grant_type: appauth_1.GRANT_TYPE_AUTHORIZATION_CODE,
                            code: payload === null || payload === void 0 ? void 0 : payload.code,
                            extras: extras,
                        });
                        tokenHandler = new appauth_1.BaseTokenRequestHandler(new HttpRequester());
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, tokenHandler.performTokenRequest({
                                tokenEndpoint: UrlHelper_1.UrlHelper.getUrl((_c = this.config.tokenUrl()) !== null && _c !== void 0 ? _c : ''),
                            }, request)];
                    case 4:
                        response = _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _e.sent();
                        if (e_1 instanceof appauth_1.AppAuthError) {
                            throw new AuthError_1.AuthError(e_1.message);
                        }
                        throw e_1;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        if (!this.isTokenResponse(payload)) {
                            throw new AuthError_1.AuthError(payload.error);
                        }
                        response = new appauth_1.TokenResponse(payload);
                        return [3 /*break*/, 8];
                    case 8:
                        stateData.token = response === null || response === void 0 ? void 0 : response.toJson();
                        return [4 /*yield*/, this.saveState(state, stateData, this.config.stateTtl)];
                    case 9:
                        _e.sent();
                        return [2 /*return*/, stateData];
                }
            });
        });
    };
    OAuth2Client.prototype.getConfig = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var stateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getState(state)];
                    case 1:
                        stateData = _a.sent();
                        if (!stateData) {
                            throw new InvalidStateError_1.InvalidStateError();
                        }
                        if (!stateData.config) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, new OAuth2Config_1.OAuth2Config(stateData.config)];
                }
            });
        });
    };
    OAuth2Client.prototype.getUserInfo = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var stateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getState(state)];
                    case 1:
                        stateData = _a.sent();
                        if (!stateData) {
                            throw new InvalidStateError_1.InvalidStateError();
                        }
                        if (!!stateData.user) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.refreshUserInfo(state)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, stateData.user];
                }
            });
        });
    };
    OAuth2Client.prototype.refreshUserInfo = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var stateData, token, userInfoHandler, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getState(state)];
                    case 1:
                        stateData = _a.sent();
                        if (!stateData) {
                            throw new InvalidStateError_1.InvalidStateError();
                        }
                        if (!stateData.token) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.getAccessToken(state)];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            return [2 /*return*/, null];
                        }
                        userInfoHandler = new UserInfoRequestHandler_1.UserInfoRequestHandler(new HttpRequester());
                        return [4 /*yield*/, userInfoHandler.performUserInfoRequest({
                                userInfoEndpoint: this.config.resourceOwnerUrl(),
                            }, new ResourceOwnerRequest_1.ResourceOwnerRequest(token.access_token))];
                    case 3:
                        user = _a.sent();
                        stateData.user = user;
                        return [4 /*yield*/, this.saveState(state, stateData, this.config.stateTtl)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    OAuth2Client.prototype.getAccessToken = function (state) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var stateData, token, expiryTime, config, extras, request, tokenHandler, response;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.getState(state)];
                    case 1:
                        stateData = _f.sent();
                        if (!stateData) {
                            throw new InvalidStateError_1.InvalidStateError();
                        }
                        if (!stateData.token) {
                            return [2 /*return*/, null];
                        }
                        token = stateData.token;
                        expiryTime = ((_a = token.issued_at) !== null && _a !== void 0 ? _a : 0) + Number.parseInt((_b = token.expires_in) !== null && _b !== void 0 ? _b : '0');
                        if (expiryTime >= Math.floor(Date.now() / 1000)) {
                            return [2 /*return*/, token];
                        }
                        if (!token.refresh_token) {
                            return [2 /*return*/, null];
                        }
                        config = new OAuth2Config_1.OAuth2Config(stateData.config);
                        extras = {
                            'client_secret': (_c = config.clientSecret) !== null && _c !== void 0 ? _c : '',
                        };
                        if (config.pkceVerification && stateData.codeVerifier) {
                            extras['code_verifier'] = stateData.codeVerifier;
                        }
                        request = new appauth_1.TokenRequest({
                            client_id: (_d = config.clientId) !== null && _d !== void 0 ? _d : '',
                            redirect_uri: (_e = config.redirectUri) !== null && _e !== void 0 ? _e : '',
                            grant_type: appauth_1.GRANT_TYPE_REFRESH_TOKEN,
                            refresh_token: token.refresh_token,
                            extras: extras,
                        });
                        tokenHandler = new appauth_1.BaseTokenRequestHandler(new HttpRequester());
                        return [4 /*yield*/, tokenHandler.performTokenRequest({
                                tokenEndpoint: this.config.tokenUrl(),
                            }, request)];
                    case 2:
                        response = _f.sent();
                        stateData.token = response.toJson();
                        return [4 /*yield*/, this.saveState(state, stateData, this.config.stateTtl)];
                    case 3:
                        _f.sent();
                        return [2 /*return*/, stateData.token];
                }
            });
        });
    };
    OAuth2Client.prototype.destroy = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stateStore.delete(this.stateStorageKey(state))];
            });
        });
    };
    OAuth2Client.prototype.initWorkflow = function (responseType, nextUri) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var authorizationUrl, extras, request, _g, authorizationHandler, stateData;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (!browser()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stateStore.cleanup()];
                    case 1:
                        _h.sent();
                        _h.label = 2;
                    case 2:
                        authorizationUrl = (_a = this.config.authorizationUrl()) !== null && _a !== void 0 ? _a : '';
                        extras = UrlHelper_1.UrlHelper.getParameters(authorizationUrl);
                        authorizationUrl = UrlHelper_1.UrlHelper.getUrl(authorizationUrl);
                        _h.label = 3;
                    case 3:
                        _g = !request;
                        if (_g) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.stateStore.get(request.state)];
                    case 4:
                        _g = ((_h.sent()) !== null);
                        _h.label = 5;
                    case 5:
                        if (!_g) return [3 /*break*/, 6];
                        request = new appauth_1.AuthorizationRequest({
                            client_id: (_b = this.config.clientId) !== null && _b !== void 0 ? _b : '',
                            redirect_uri: (_c = this.config.redirectUri) !== null && _c !== void 0 ? _c : '',
                            scope: (_e = (_d = this.config.scopes) === null || _d === void 0 ? void 0 : _d.join(' ')) !== null && _e !== void 0 ? _e : '',
                            response_type: responseType,
                            extras: extras,
                        }, new appauth_1.DefaultCrypto(), this.config.pkceVerification);
                        return [3 /*break*/, 3];
                    case 6:
                        authorizationHandler = new AuthorizationRequestHandler_1.AuthorizationRequestHandler();
                        stateData = {
                            state: request.state,
                            config: this.config.toJson(),
                            responseType: responseType,
                            nextUrl: nextUri,
                            authorizationUri: ''
                        };
                        if (!(this.config.pkceVerification && responseType === appauth_1.AuthorizationRequest.RESPONSE_TYPE_CODE)) return [3 /*break*/, 8];
                        return [4 /*yield*/, request.setupCodeVerifier()];
                    case 7:
                        _h.sent();
                        stateData.codeVerifier = (_f = request.internal) === null || _f === void 0 ? void 0 : _f.code_verifier;
                        _h.label = 8;
                    case 8:
                        stateData.authorizationUri = authorizationHandler.buildRequestUrl({
                            authorizationEndpoint: authorizationUrl,
                        }, request);
                        return [4 /*yield*/, this.saveState(request.state, stateData, this.config.stateTtl)];
                    case 9:
                        _h.sent();
                        return [2 /*return*/, stateData];
                }
            });
        });
    };
    OAuth2Client.prototype.getState = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateStore.get(this.stateStorageKey(state))];
                    case 1:
                        data = _a.sent();
                        if (!data) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, JSON.parse(data)];
                }
            });
        });
    };
    OAuth2Client.prototype.saveState = function (state, data, timeout) {
        if (timeout === void 0) { timeout = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.stateStorageKey(state);
                        return [4 /*yield*/, this.stateStore.delete(key)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.stateStore.put(key, JSON.stringify(data), timeout)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OAuth2Client.prototype.deleteState = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateStore.delete(this.stateStorageKey(state))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OAuth2Client.prototype.stateStorageKey = function (state) {
        return "oauth:state:".concat(state);
    };
    OAuth2Client.prototype.isTokenResponse = function (response) {
        return response.error === undefined;
    };
    return OAuth2Client;
}());
exports.OAuth2Client = OAuth2Client;
