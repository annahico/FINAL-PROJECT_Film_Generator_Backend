"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
// Define the schema for a user movie
var UserMovieSchema = new mongoose_1.Schema({
    movieTitle: {
        type: String,
        required: true
    },
    movieDescription: {
        type: String,
        required: true
    },
    moviePlaybackPath: {
        type: String,
        required: true
    },
    movieStudio: {
        type: String,
        default: null
    },
    movieCredits: {
        type: String,
        default: null
    }
});
// Define the schema for the community uploads
var CommunityUploadsSchema = new mongoose_1.Schema({
    user: {
        userId: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true
        },
        userName: {
            type: String,
            required: true
        }
    },
    userMovies: [UserMovieSchema]
});
// Export the model
exports.default = mongoose_1.default.model('CommunityUploads', CommunityUploadsSchema);
//# sourceMappingURL=communityUploadsModel.js.map