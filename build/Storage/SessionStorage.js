"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStorage = void 0;
var LocalStorage_1 = require("./LocalStorage");
var SessionStorage = /** @class */ (function (_super) {
    __extends(SessionStorage, _super);
    function SessionStorage(prefix) {
        if (prefix === void 0) { prefix = 'ssofy'; }
        var _this = _super.call(this, prefix) || this;
        _this.storage = sessionStorage;
        return _this;
    }
    return SessionStorage;
}(LocalStorage_1.LocalStorage));
exports.SessionStorage = SessionStorage;
