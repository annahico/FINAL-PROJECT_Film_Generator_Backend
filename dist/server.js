"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var mongoose_1 = __importDefault(require("mongoose"));
var endpoints_config_1 = __importDefault(require("./endpoints.config"));
var logger_1 = require("./helpers/logger");
var moviesAPI_1 = __importDefault(require("./routes/moviesAPI"));
var usersAPI_1 = __importDefault(require("./routes/usersAPI"));
var app = (0, express_1.default)();
// Middleware setup
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)()); // Additional configuration can be added here if needed
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Start server
app.listen(process.env.PORT, function () {
    logger_1.logger.info("App is listening on port ".concat(endpoints_config_1.default.PORT));
});
// MongoDB configuration and connection
var db = endpoints_config_1.default.MONGO_URI;
mongoose_1.default.connect(db)
    .then(function () {
    console.log('Mongoose successfully connected');
    logger_1.logger.info('Mongoose successfully connected');
})
    .catch(function (err) {
    logger_1.logger.error('Mongoose connection error:', err);
});
// Routes
app.use('/api/users', usersAPI_1.default);
app.use('/api/movies', moviesAPI_1.default);
// Root endpoint
app.get('/', function (req, res) {
    res.send('Welcome to babel node');
});
// Error handling middleware (for catching errors in routes)
app.use(function (err, req, res, next) {
    logger_1.logger.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});
exports.default = app;
//# sourceMappingURL=server.js.map