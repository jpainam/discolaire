/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
exports.useSheet = void 0;
var jotai_1 = require("jotai");
var sheetAtom = (0, jotai_1.atom)({
    isOpen: false,
    view: null,
    title: null,
    description: null,
    placement: "right",
    className: "w-[700px]",
});
function useSheet() {
    var state = (0, jotai_1.useAtomValue)(sheetAtom);
    var setState = (0, jotai_1.useSetAtom)(sheetAtom);
    var openSheet = function (_a) {
        var view = _a.view, placement = _a.placement, className = _a.className, title = _a.title, description = _a.description;
        setState(__assign(__assign({}, state), { isOpen: true, view: view, title: title, description: description, placement: placement, className: className }));
    };
    var closeSheet = function () {
        setState(__assign(__assign({}, state), { isOpen: false, title: null, description: null }));
    };
    return __assign(__assign({}, state), { openSheet: openSheet, closeSheet: closeSheet });
}
exports.useSheet = useSheet;
