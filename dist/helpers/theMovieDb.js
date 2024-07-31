"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.revisedQuery = revisedQuery;
exports.formatQuery = formatQuery;
var logger_1 = require("./logger");
function revisedQuery(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var keywordsList, genreList;
        var with_genres = _b.with_genres, with_keywords = _b.with_keywords, sort_by = _b.sort_by, primary_release_year = _b.primary_release_year;
        return __generator(this, function (_c) {
            try {
                if (primary_release_year) {
                    return [2 /*return*/, {
                            with_genres: with_genres,
                            with_keywords: with_keywords,
                            sort_by: sort_by
                        }];
                }
                if (with_keywords) {
                    keywordsList = with_keywords.split(",");
                    keywordsList.splice(-1, 1);
                    return [2 /*return*/, {
                            with_genres: with_genres,
                            sort_by: sort_by,
                            with_keywords: keywordsList.toString()
                        }];
                }
                if (sort_by) {
                    return [2 /*return*/, {
                            with_genres: with_genres
                        }];
                }
                if (with_genres) {
                    genreList = with_genres.split(",");
                    genreList.splice(-1, 1);
                    return [2 /*return*/, {
                            with_genres: genreList.toString()
                        }];
                }
                return [2 /*return*/, {}];
            }
            catch (err) {
                logger_1.logger.error("Failed to revise query: ".concat(err.message));
                throw err;
            }
            return [2 /*return*/];
        });
    });
}
function formatQuery(movieSearchCriteria) {
    return __awaiter(this, void 0, void 0, function () {
        var yearRange;
        return __generator(this, function (_a) {
            if (movieSearchCriteria === null || movieSearchCriteria === void 0 ? void 0 : movieSearchCriteria.primary_release_year) {
                yearRange = movieSearchCriteria.primary_release_year.toString().split("-");
                movieSearchCriteria['release_date.gte'] = "".concat(yearRange[0], "-01-01");
                movieSearchCriteria['release_date.lte'] = "".concat(yearRange[1], "-01-01");
                delete movieSearchCriteria.primary_release_year;
            }
            return [2 /*return*/, movieSearchCriteria];
        });
    });
}
//# sourceMappingURL=theMovieDb.js.map