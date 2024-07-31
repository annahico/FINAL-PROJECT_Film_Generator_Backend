import CommentSchema from '../MongoModels/commentModel';
import { logger } from '../helpers/logger';
import { checkIfDiscussionExists } from '../services/movieDbService';
import { tsCommentSchema } from '../tsModels/commentModels';
import { movieObject } from '../tsModels/movieGenerationModel';

export async function updateSingleComment(_id: string, commentText: string): Promise<boolean> {
    if (!_id || !commentText) {
        return false;
    }

    try {
        await CommentSchema.updateOne({ _id }, { $set: { commentText } });
        return true;
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
            commentDownVotes: 0,
            commentUpVotes: 0,
            isDeleted: false,
            depth: commentData.depth || 1,
            parentId: commentData.parentId || null
        };

        // Crear una nueva instancia de comentario
        const newComment = new CommentSchema(commentObj);
        
        // Guardar el comentario
        const savedComment: CommentDocument = await newComment.save();
        
        // Transformar el documento guardado al tipo tsCommentSchema
        return {
            movieId: savedComment.movieId,
            user: savedComment.user,
            commentText: savedComment.commentText,
            commentDownVotes: savedComment.commentDownVotes,
            commentUpVotes: savedComment.commentUpVotes,
            isDeleted: savedComment.isDeleted,
            depth: savedComment.depth,
            parentId: savedComment.parentId
        };
    } catch (err) {
        logger.error(`Failed to add comment: ${(err as Error).message}`);
        throw err;
    }
}

export async function getCommentsForPost(movie: movieObject): Promise<{ count: number; comments: any }> {
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
                if (key === comment.parentId.toString()) {
                    value.children[comment._id] = comment;
                    return;
                }
                if (value.children) {
                    filterChildren(comment, value.children);
                }
            }
        };

        for (const comment of commentsForMovie) {
            if (comment.commentScore < -5) comment.commentText = "This comment is hidden due to low scoring";
            comment['children'] = {};
            if (!comment.parentId) {
                threads[comment._id] = comment;
            } else {
                filterChildren(comment, threads);
            }
        }

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
        );
    } catch (err) {
        logger.error(`Failed to delete comment: ${(err as Error).message}`);
        throw err;
    }
}

export async function setScore(_id: string, commentScore: number, value: number, userId: string, changedFromUpVote: boolean, changedFromDownVote: boolean): Promise<any> {
    try {
        if (changedFromDownVote) {
            return await CommentSchema.findByIdAndUpdate(
                _id,
                { $set: { commentScore }, $pull: { commentDownVotes: userId } },
                { new: true }
            );
        }
        if (changedFromUpVote) {
            return await CommentSchema.findByIdAndUpdate(
                _id,
                { $set: { commentScore }, $pull: { commentUpVotes: userId } },
                { new: true }
            );
        }

        const scoreType = (value === 1) ? 'commentUpVotes' : 'commentDownVotes';
        return await CommentSchema.findByIdAndUpdate(
            _id,
            { $set: { commentScore }, $push: { [scoreType]: userId } },
            { new: true }
        );
    } catch (err) {
        logger.error(`Failed to update comment score: ${(err as Error).message}`);
        throw err;
    }
}
