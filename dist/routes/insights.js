"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var logger_1 = require("../helpers/logger");
var dataInsightService_1 = require("../services/dataInsightService");
var router = express_1.default.Router();
router.get('/:startDate/:endDate/:chartType', function (req, res) {
    (0, dataInsightService_1.chartController)(req.params.startDate, req.params.endDate, req.params.chartType)
        .then(function (data) {
        res.send(JSON.stringify(data));
    }).catch(function (err) {
        logger_1.logger.error("Failed to get data on genres: ".concat(err.data));
        res.status(404).send("Failed to get data on genres");
    });
});
exports.default = router;
//# sourceMappingURL=insights.js.map