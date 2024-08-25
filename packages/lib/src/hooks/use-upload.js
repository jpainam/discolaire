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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
/* eslint-disable @typescript-eslint/no-unsafe-argument */
var react_1 = require("react");
var useUpload = function () {
    var _a = (0, react_1.useState)(false), isPending = _a[0], setIsPending = _a[1];
    var _b = (0, react_1.useState)([]), data = _b[0], setData = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var updateFileState = function (index, newState) {
        setData(function (prevUploads) {
            var updatedUploads = __spreadArray([], prevUploads, true);
            // @ts-expect-error TODO: fix this
            updatedUploads[index] = __assign(__assign({}, updatedUploads[index]), newState);
            return updatedUploads;
        });
    };
    var onUpload = function (inputs, metadata) { return __awaiter(void 0, void 0, void 0, function () {
        var files, initialUploads;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = Array.isArray(inputs) ? inputs : [inputs];
                    initialUploads = files.map(function (file) { return ({
                        file: file,
                        isPending: false,
                        isComplete: false,
                        error: null,
                        data: null,
                    }); });
                    setData(initialUploads);
                    setIsPending(true);
                    setError(null);
                    return [4 /*yield*/, Promise.all(files.map(function (file, index) { return __awaiter(void 0, void 0, void 0, function () {
                            var response, _a, url, fields, formData_1, uploadResponse, uploadedData, e, e, err_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        updateFileState(index, { isPending: true });
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 11, 12, 13]);
                                        return [4 /*yield*/, fetch(
                                            // TODO: replace with actual upload endpoint
                                            "http://localhost/api/upload", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    filename: file.name,
                                                    dest: metadata === null || metadata === void 0 ? void 0 : metadata.dest,
                                                    contentType: file.type,
                                                }),
                                            })];
                                    case 2:
                                        response = _b.sent();
                                        if (!response.ok) return [3 /*break*/, 8];
                                        return [4 /*yield*/, response.json()];
                                    case 3:
                                        _a = _b.sent(), url = _a.url, fields = _a.fields;
                                        formData_1 = new FormData();
                                        Object.entries(fields).forEach(function (_a) {
                                            var key = _a[0], value = _a[1];
                                            formData_1.append(key, value);
                                        });
                                        formData_1.append("file", file);
                                        return [4 /*yield*/, fetch(url, {
                                                method: "POST",
                                                body: formData_1,
                                            })];
                                    case 4:
                                        uploadResponse = _b.sent();
                                        if (!uploadResponse.ok) return [3 /*break*/, 5];
                                        uploadedData = {
                                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                            id: fields.key,
                                            url: url,
                                        };
                                        updateFileState(index, { isPending: false, data: uploadedData });
                                        return [3 /*break*/, 7];
                                    case 5: return [4 /*yield*/, uploadResponse.json()];
                                    case 6:
                                        e = _b.sent();
                                        updateFileState(index, { error: e });
                                        _b.label = 7;
                                    case 7: return [3 /*break*/, 10];
                                    case 8: return [4 /*yield*/, response.json()];
                                    case 9:
                                        e = _b.sent();
                                        updateFileState(index, { error: e });
                                        _b.label = 10;
                                    case 10: return [3 /*break*/, 13];
                                    case 11:
                                        err_1 = _b.sent();
                                        updateFileState(index, { error: err_1 });
                                        return [3 /*break*/, 13];
                                    case 12:
                                        updateFileState(index, { isPending: false });
                                        return [7 /*endfinally*/];
                                    case 13: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    setIsPending(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return { onUpload: onUpload, isPending: isPending, data: data, error: error, isError: !!error };
};
exports.default = useUpload;
