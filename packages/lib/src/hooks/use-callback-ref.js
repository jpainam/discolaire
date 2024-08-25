"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCallbackRef = void 0;
var React = require("react");
/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/use-callback-ref/src/useCallbackRef.tsx
 */
/**
 * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 */
function useCallbackRef(callback) {
    var callbackRef = React.useRef(callback);
    React.useEffect(function () {
        callbackRef.current = callback;
    });
    // https://github.com/facebook/react/issues/19240
    return React.useMemo(function () { return (function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = callbackRef.current) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([callbackRef], args, false));
    }); }, []);
}
exports.useCallbackRef = useCallbackRef;
