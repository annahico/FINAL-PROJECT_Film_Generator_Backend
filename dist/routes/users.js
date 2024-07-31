"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var logger_1 = require("../../helpers/logger");
var userModel_1 = __importDefault(require("../../models/userModel"));
// eslint-disable-next-line new-cap
var router = express_1.default.Router();
/**
 * @Route POST /api/users/register
 * @Desc Provides API to register a new user
 */
router.post('/register', function (req, res) {
    var newUser = new userModel_1.default({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    newUser.save()
        .then(function (user) {
        res.status(201).json(user);
    })
        .catch(function (err) {
        logger_1.logger.error(err);
        res.status(500).send('Error registering user');
    });
});
/**
 * @Route POST /api/users/login
 * @Desc Provides API for user login
 */
router.post('/login', function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password;
    userModel_1.default.findOne({ email: email })
        .then(function (user) {
        if (!user) {
            return res.status(404).send('No user found with this email');
        }
        if (password === user.password) {
            res.status(200).json(user);
        }
        else {
            res.status(401).send('Incorrect password');
        }
    })
        .catch(function (err) {
        logger_1.logger.error(err);
        res.status(500).send('Error logging in');
    });
});
/**
 * @Route POST /api/users/update
 * @Desc Provides API to update a user's profile
 */
router.post('/update', function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password;
    userModel_1.default.updateOne({ email: email }, { $set: { password: password } })
        .then(function (result) {
        if (result.modifiedCount > 0) {
            res.status(200).send("User updated: " + email);
        }
        else {
            res.status(404).send('User not found');
        }
    })
        .catch(function (err) {
        logger_1.logger.error(err);
        res.status(500).send('Error updating user');
    });
});
/**
 * @Route POST /api/users/delete
 * @Desc Provides API to delete a user's profile
 */
router.post('/delete', function (req, res) {
    var email = req.body.email;
    userModel_1.default.deleteOne({ email: email })
        .then(function (result) {
        if (result.deletedCount > 0) {
            res.status(200).send("User with email " + email + " successfully deleted");
        }
        else {
            res.status(404).send('User not found');
        }
    })
        .catch(function (err) {
        logger_1.logger.error(err);
        res.status(500).send('Error deleting user');
    });
});
exports.default = router;
//# sourceMappingURL=users.js.map