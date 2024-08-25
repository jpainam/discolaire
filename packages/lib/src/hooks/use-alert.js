"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAlert = void 0;
var jotai_1 = require("jotai");
var alertAtom = (0, jotai_1.atom)({
    isOpen: false,
    title: null,
    description: null,
    onCancel: undefined,
    onConfirm: undefined,
});
function useAlert() {
    var state = (0, jotai_1.useAtomValue)(alertAtom);
    var setState = (0, jotai_1.useSetAtom)(alertAtom);
    var openAlert = function (_a) {
        var title = _a.title, description = _a.description, onCancel = _a.onCancel, onConfirm = _a.onConfirm;
        setState(__assign(__assign({}, state), { isOpen: true, title: title, description: description, onCancel: onCancel, onConfirm: onConfirm }));
    };
    var closeAlert = function () {
        setState(__assign(__assign({}, state), { isOpen: false, title: null, description: null, onCancel: undefined, onConfirm: undefined }));
    };
    return __assign(__assign({}, state), { openAlert: openAlert, closeAlert: closeAlert });
}
exports.useAlert = useAlert;
