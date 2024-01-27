"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlHelper = void 0;
var UrlHelper = /** @class */ (function () {
    function UrlHelper() {
    }
    UrlHelper.getUrl = function (url) {
        var result = new URL(url);
        return result.origin + result.pathname;
    };
    UrlHelper.getParameters = function (url) {
        var currentUrl = new URL(url);
        var searchParams = new URLSearchParams(currentUrl.search);
        var paramsJson = {};
        searchParams.forEach(function (value, key) {
            paramsJson[key] = value;
        });
        if (currentUrl.hash) {
            var fragment = currentUrl.hash.substring(1);
            var secondHashIndex = fragment.indexOf('#');
            if (secondHashIndex !== -1) {
                fragment = fragment.substring(0, secondHashIndex);
            }
            var firstQuestionMarkIndex = fragment.indexOf('?');
            if (firstQuestionMarkIndex !== -1) {
                fragment = fragment.substring(firstQuestionMarkIndex);
            }
            var hashParams = new URLSearchParams(fragment);
            hashParams.forEach(function (value, key) {
                paramsJson[key] = value;
            });
        }
        return paramsJson;
    };
    return UrlHelper;
}());
exports.UrlHelper = UrlHelper;
