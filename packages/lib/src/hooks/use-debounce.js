"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = void 0;
var React = require("react");
// A better implementation https://github.com/xnimorz/use-debounce/tree/master
function useDebounce(value, delay) {
    var _a = React.useState(value), debouncedValue = _a[0], setDebouncedValue = _a[1];
    React.useEffect(function () {
        var timer = setTimeout(function () { return setDebouncedValue(value); }, delay !== null && delay !== void 0 ? delay : 500);
        return function () {
            clearTimeout(timer);
        };
    }, [value, delay]);
    return debouncedValue;
}
exports.useDebounce = useDebounce;
