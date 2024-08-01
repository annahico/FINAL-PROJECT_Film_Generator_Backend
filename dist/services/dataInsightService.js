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
exports.calculateData = calculateData;
exports.calculateDailyGenerations = calculateDailyGenerations;
exports.chartController = chartController;
var logger_1 = require("../helpers/logger");
function calculateData(startDate_1, endDate_1) {
    return __awaiter(this, arguments, void 0, function (startDate, endDate, propObj, propList, type) {
        var movies, data_1, labels_1;
        if (propObj === void 0) { propObj = {}; }
        return __generator(this, function (_a) {
            try {
                movies = propList
                    .map(function (user) { return user.userMovies.filter(function (generation) {
                    return generation.movieSearchCriteria &&
                        generation.movieGenerationDate > startDate &&
                        generation.movieGenerationDate < endDate;
                }); })
                    .reduce(function (acc, value) { return acc.concat(value); }, []);
                movies.forEach(function (movieGen) {
                    var _a, _b;
                    if (type === 'with_genres' || type === 'with_keywords') {
                        var propGenList = movieGen.movieSearchCriteria && movieGen.movieSearchCriteria[type]
                            ? movieGen.movieSearchCriteria[type].split(",")
                            : [];
                        propGenList.forEach(function (prop) {
                            if (prop !== '')
                                propObj[prop] = (propObj[prop] || 0) + 1;
                        });
                    }
                    else if (((_b = (_a = movieGen === null || movieGen === void 0 ? void 0 : movieGen.movieSearchCriteria) === null || _a === void 0 ? void 0 : _a.release_date) === null || _b === void 0 ? void 0 : _b.gte) && type === 'release_date.gte') {
                        var prop = movieGen.movieSearchCriteria.release_date.gte.split("-")[0];
                        propObj[prop] = (propObj[prop] || 0) + 1;
                    }
                });
                data_1 = [];
                labels_1 = [];
                Object.entries(propObj).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    data_1.push(value);
                    labels_1.push(key);
                });
                return [2 /*return*/, {
                        labels: labels_1,
                        datasets: [{
                                label: 'Number of Selections',
                                data: data_1,
                                backgroundColor: [
                                    '#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6', '#c2f0c2',
                                    '#ffb366', '#c2e0ff', '#e6c2ff', '#ff6666', '#66ff99', '#ffccff', '#c2c2c2',
                                    '#ff9966', '#c2f0ff', '#e6ff66', '#b3b3ff', '#ffb3cc', '#c2f5c2', '#c2c2e6'
                                ]
                            }]
                    }];
            }
            catch (err) {
                logger_1.logger.error("Failed to get genre data: ".concat(err.message));
                throw err;
            }
            return [2 /*return*/];
        });
    });
}
function calculateDailyGenerations(startDate, endDate, moviesObj) {
    return __awaiter(this, void 0, void 0, function () {
        var movies, dates, count, currentStartDate, end, _loop_1;
        return __generator(this, function (_a) {
            try {
                movies = moviesObj
                    .map(function (user) { return user.userMovies.filter(function (generation) {
                    return generation.movieGenerationDate > startDate &&
                        generation.movieGenerationDate < endDate;
                }); })
                    .reduce(function (acc, value) { return acc.concat(value); }, []);
                dates = [];
                count = [];
                currentStartDate = new Date(startDate).getTime();
                end = new Date(endDate).getTime();
                _loop_1 = function () {
                    var futureDate = new Date(currentStartDate + 86400000).toISOString();
                    var filteredMovies = movies.filter(function (generation) {
                        return generation.movieGenerationDate >= startDate && generation.movieGenerationDate <= futureDate;
                    });
                    dates.push(futureDate);
                    count.push(filteredMovies.length);
                    currentStartDate = new Date(futureDate).getTime();
                };
                while (currentStartDate < end) {
                    _loop_1();
                }
                return [2 /*return*/, {
                        labels: dates,
                        datasets: [{
                                label: 'Number of Selections',
                                data: count,
                                backgroundColor: [
                                    '#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6', '#c2f0c2',
                                    '#ffb366', '#c2e0ff', '#e6c2ff', '#ff6666', '#66ff99', '#ffccff', '#c2c2c2',
                                    '#ff9966', '#c2f0ff', '#e6ff66', '#b3b3ff', '#ffb3cc', '#c2f5c2', '#c2c2e6'
                                ]
                            }]
                    }];
            }
            catch (err) {
                logger_1.logger.error("Failed to get data for daily generations: ".concat(err.message));
                throw err;
            }
            return [2 /*return*/];
        });
    });
}
// Definir y exportar el chartController
function chartController(startDate, endDate, chartType) {
    return __awaiter(this, void 0, void 0, function () {
        var result, propObj, propList, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    result = void 0;
                    propObj = {};
                    propList = [];
                    if (!(chartType === 'daily')) return [3 /*break*/, 2];
                    return [4 /*yield*/, calculateDailyGenerations(startDate, endDate, propList)];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, calculateData(startDate, endDate, propObj, propList, chartType)];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, result];
                case 5:
                    err_1 = _a.sent();
                    logger_1.logger.error("Failed to get data for chart: ".concat(err_1.message));
                    throw err_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=dataInsightService.js.map