"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
// Define el esquema para los comentarios
var CommentSchema = new Schema({
    movieId: {
        type: String,
        required: true
    },
    depth: {
        type: Number,
        default: 1
    },
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null
    },
    postedDate: {
        type: String,
        default: new Date().toISOString()
    },
    user: {
        userId: mongoose_1.default.Schema.Types.ObjectId,
        userName: String
    },
    commentText: {
        type: String,
        required: true
    },
    commentScore: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    commentUpVotes: {
        type: [mongoose_1.default.Schema.Types.ObjectId], // Cambiado a un array de ObjectId
        default: []
    },
    commentDownVotes: {
        type: [mongoose_1.default.Schema.Types.ObjectId], // Cambiado a un array de ObjectId
        default: []
    }
});
// Exporta el modelo basado en el esquema
exports.default = mongoose_1.default.model('Comment', CommentSchema);
//# sourceMappingURL=commentModel.js.map