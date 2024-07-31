import mongoose, { Document, Schema } from 'mongoose';

// Define the schema for a user movie
const UserMovieSchema = new Schema({
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
const CommunityUploadsSchema = new Schema({
    user: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userName: {
            type: String,
            required: true
        }
    },
    userMovies: [UserMovieSchema]
});

// Create an interface for the CommunityUploads model
export interface ICommunityUploads extends Document {
    user: {
        userId: mongoose.Types.ObjectId;
        userName: string;
    };
    userMovies: {
        movieTitle: string;
        movieDescription: string;
        moviePlaybackPath: string;
        movieStudio?: string | null;
        movieCredits?: string | null;
    }[];
}

// Export the model
export default mongoose.model<ICommunityUploads>('CommunityUploads', CommunityUploadsSchema);
