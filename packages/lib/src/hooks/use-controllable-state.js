"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useControllableState = void 0;
var React = require("react");
var use_callback_ref_1 = require("./use-callback-ref");
function useControllableState(_a) {
    var prop = _a.prop, defaultProp = _a.defaultProp, 
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _b = _a.onChange, 
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange = _b === void 0 ? function () { } : _b;
    var _c = useUncontrolledState({
        defaultProp: defaultProp,
        onChange: onChange,
    }), uncontrolledProp = _c[0], setUncontrolledProp = _c[1];
    var isControlled = prop !== undefined;
    var value = isControlled ? prop : uncontrolledProp;
    var handleChange = (0, use_callback_ref_1.useCallbackRef)(onChange);
    var setValue = React.useCallback(function (nextValue) {
        if (isControlled) {
            var setter = nextValue;
            var value_1 = typeof nextValue === "function" ? setter(prop) : nextValue;
            if (value_1 !== prop)
                handleChange(value_1);
        }
        else {
            setUncontrolledProp(nextValue);
        }
    }, [isControlled, prop, setUncontrolledProp, handleChange]);
    return [value, setValue];
}
exports.useControllableState = useControllableState;
function useUncontrolledState(_a) {
    var defaultProp = _a.defaultProp, onChange = _a.onChange;
    var uncontrolledState = React.useState(defaultProp);
    var value = uncontrolledState[0];
    var prevValueRef = React.useRef(value);
    var handleChange = (0, use_callback_ref_1.useCallbackRef)(onChange);
    React.useEffect(function () {
        if (prevValueRef.current !== value) {
            handleChange(value);
            prevValueRef.current = value;
        }
    }, [value, prevValueRef, handleChange]);
    return uncontrolledState;
}
