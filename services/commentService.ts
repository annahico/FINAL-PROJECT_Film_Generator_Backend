// commentController.ts

import CommentSchema from '../MongoModels/commentModel';
import { logger } from '../helpers/logger';
import { checkIfDiscussionExists } from '../services/discussionDbService';
import { tsCommentSchema } from '../tsModels/commentModels';
import { movieObject } from '../tsModels/movieGenerationModel';

// Importar todos los servicios de películas de una sola vez
import * as MovieServices from '../services/movieDbService';

interface UpdateResult {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId?: string;
    upsertedCount?: number;
    matchedCount: number;
}

export async function updateSingleComment(_id: string, commentText: string): Promise<boolean> {
    if (!_id || !commentText) {
        return false;
    }

    try {
        const result: UpdateResult = await CommentSchema.updateOne({ _id }, { $set: { commentText } }).exec();
        return result.modifiedCount > 0;
    } catch (err) {
        logger.error(`Failed to update comment: ${(err as Error).message}`);
        throw err;
    }
}

export async function addComment(commentData: any): Promise<tsCommentSchema> {
    try {
        const commentObj: tsCommentSchema = {
            movieId: commentData.movieId,
            user: {
                userId: commentData.id,
                userName: commentData.userName
            },
            commentText: commentData.commentText,
            commentDownVotes: [],
            commentUpVotes: [],
            isDeleted: false,
            depth: commentData.depth || 1,
            parentId: commentData.parentId || null
        };

        const savedComment = await new CommentSchema(commentObj).save();
        return savedComment.toObject() as tsCommentSchema;
    } catch (err) {
        logger.error(`Failed to add comment: ${(err as Error).message}`);
        throw err;
    }
}

export async function getCommentsForPost(movie: movieObject): Promise<{ count: number, comments: Record<string, any> }> {
    try {
        const isDiscussion = await checkIfDiscussionExists(movie.movieId);
        if (!isDiscussion) {
            return { count: 0, comments: {} };
        }

        const commentsForMovie = await CommentSchema.find({ movieId: movie.movieId }).lean().exec();
        const threads: Record<string, any> = {};

        const filterChildren = (comment: any, thread: any) => {
            for (const key in thread) {
                const value = thread[key];
                if (key === comment.parentId?.toString()) {
                    value.children[comment._id] = comment;
                    return;
                }
                if (value.children) {
                    filterChildren(comment, value.children);
                }
            }
        };

        commentsForMovie.forEach((comment: any) => {
            if (comment.commentScore < -5) comment.commentText = "This comment is hidden due to low scoring";
            comment['children'] = {};
            if (!comment.parentId) {
                threads[comment._id] = comment;
            } else {
                filterChildren(comment, threads);
            }
        });

        return { count: commentsForMovie.length, comments: threads };
    } catch (err) {
        logger.error(`Failed to get comments for movie ${movie.movieId}: ${(err as Error).message}`);
        throw err;
    }
}

export async function deleteComment(_id: string): Promise<any> {
    try {
        return await CommentSchema.findOneAndUpdate(
            { _id },
            { $set: { commentText: 'This comment has been deleted', 'user.userId': null, 'user.userName': 'Unknown', isDeleted: true } },
            { new: true }
        ).exec();
    } catch (err) {
        logger.error(`Failed to delete comment: ${(err as Error).message}`);
        throw err;
    }
}

export async function setScore(
    _id: string,
    commentScore: number,
    value: number,
    userId: string,
    changedFromUpVote: boolean,
    changedFromDownVote: boolean
): Promise<any> {
    try {
        if (changedFromDownVote) {
            return await CommentSchema.findByIdAndUpdate(
                _id,
                { $set: { commentScore }, $pull: { commentDownVotes: userId } },
                { new: true }
            ).exec();
        }
        if (changedFromUpVote) {
            return await CommentSchema.findByIdAndUpdate(
                _id,
                { $set: { commentScore }, $pull: { commentUpVotes: userId } },
                { new: true }
            ).exec();
        }

        const scoreType = (value === 1) ? 'commentUpVotes' : 'commentDownVotes';
        return await CommentSchema.findByIdAndUpdate(
            _id,
            { $set: { commentScore }, $push: { [scoreType]: userId } },
            { new: true }
        ).exec();
    } catch (err) {
        logger.error(`Failed to update comment score: ${(err as Error).message}`);
        throw err;
    }
}

// Reexportar funciones del servicio de películas directamente
export const {
    createCommunityMovieFromService: createCommunityMovie,
    deleteCommunityMovieFromService: deleteCommunityMovie,
    getAllCommunityMoviesFromService: getAllCommunityMovies,
    getAllDiscussionsFromService: getAllDiscussions,
    getMovieFromService: getMovie,
    getSingleCommunityMovieFromService: getSingleCommunityMovie,
    getUserUploadsForSingleUserFromService: getUserUploadsForSingleUser,
    updateUserMovieFromService: updateUserMovie
} = MovieServices;
