"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = void 0;
var jotai_1 = require("jotai");
var utils_1 = require("jotai/utils");
var configAtom = (0, utils_1.atomWithStorage)("theme", "");
function useTheme() {
    return (0, jotai_1.useAtom)(configAtom);
}
exports.useTheme = useTheme;
