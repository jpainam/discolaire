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
exports.useModal = void 0;
var jotai_1 = require("jotai");
var modalAtom = (0, jotai_1.atom)({
    isOpen: false,
    view: null,
    title: null,
    className: "",
    description: null,
});
function useModal() {
    var state = (0, jotai_1.useAtomValue)(modalAtom);
    var setState = (0, jotai_1.useSetAtom)(modalAtom);
    var openModal = function (_a) {
        var view = _a.view, title = _a.title, description = _a.description, className = _a.className;
        setState(__assign(__assign({}, state), { isOpen: true, view: view, title: title, description: description, className: className }));
    };
    var closeModal = function () {
        setState(__assign(__assign({}, state), { isOpen: false }));
    };
    return __assign(__assign({}, state), { openModal: openModal, closeModal: closeModal });
}
exports.useModal = useModal;
