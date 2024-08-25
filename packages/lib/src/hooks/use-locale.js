"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocale = void 0;
var react_i18next_1 = require("react-i18next");
var useLocale = function (namespace) {
    if (namespace === void 0) { namespace = "common"; }
    var _a = (0, react_i18next_1.useTranslation)(namespace), i18n = _a.i18n, t = _a.t;
    var isLocaleReady = Object.keys(i18n).length > 0;
    return {
        i18n: i18n,
        t: t,
        isLocaleReady: isLocaleReady,
    };
};
exports.useLocale = useLocale;
