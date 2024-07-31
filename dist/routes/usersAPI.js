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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userModel_1 = __importDefault(require("../MongoModels/userModel"));
var logger_1 = require("../helpers/logger");
var auth_1 = require("../middleware/auth");
var userDbService_1 = require("../services/userDbService");
var router = express_1.default.Router();
// @route GET /user
// @desc Get user info
router.get('/user', auth_1.getAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.token) {
                    return [2 /*return*/, res.status(401).send('No token found')];
                }
                id = req.token.id;
                logger_1.logger.info("User info decoded: ".concat(id));
                return [4 /*yield*/, userModel_1.default.findById(id).select('-password').exec()];
            case 1:
                user = _a.sent();
                if (user) {
                    logger_1.logger.info("User found: ".concat(user));
                    res.send({
                        user: {
                            id: user._id,
                            name: user.name,
                            userName: user.userName,
                            email: user.email
                        }
                    });
                }
                else {
                    res.status(404).send('User not found');
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                logger_1.logger.error("Failed to validate user: ".concat(err_1.message));
                res.status(500).json({ msg: 'Failed to validate user' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// @route POST /update
// @desc Update user profile
router.post('/update', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userDetails, id, updatedUser, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.body.user;
                userDetails = req.body.userDetails;
                if (!user || !userDetails) {
                    return [2 /*return*/, res.status(400).send('Missing user or user details')];
                }
                id = user.id;
                if (id !== userDetails._id) {
                    return [2 /*return*/, res.status(401).send('You do not have the privileges to update this user')];
                }
                return [4 /*yield*/, (0, userDbService_1.updateUser)(id, userDetails)];
            case 1:
                updatedUser = _a.sent();
                if (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.message) {
                    return [2 /*return*/, res.status(401).send(updatedUser.message)];
                }
                res.send(updatedUser);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                logger_1.logger.error("Failed to update user: ".concat(err_2.message));
                res.status(err_2.status || 500).send(err_2.message || 'Failed to update user');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=usersAPI.js.map