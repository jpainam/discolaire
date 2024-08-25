"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateQueryString = void 0;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
function useCreateQueryString() {
    var searchParams = (0, navigation_1.useSearchParams)();
    // example https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams
    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    var createQueryString = (0, react_1.useCallback)(function (params) {
        var newSearchParams = new URLSearchParams(searchParams === null || searchParams === void 0 ? void 0 : searchParams.toString());
        for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value === null || value === undefined || value === "") {
                newSearchParams.delete(key);
            }
            else {
                newSearchParams.set(key, String(value));
            }
        }
        return newSearchParams.toString();
    }, [searchParams]);
    return { createQueryString: createQueryString };
}
exports.useCreateQueryString = useCreateQueryString;
