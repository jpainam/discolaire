"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResolvedTheme = void 0;
var next_themes_1 = require("next-themes");
var useResolvedTheme = function () {
    var theme = (0, next_themes_1.useTheme)();
    return theme.resolvedTheme;
};
exports.useResolvedTheme = useResolvedTheme;
