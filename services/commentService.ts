import CommentSchema from '../MongoModels/commentModel';
import { logger } from '../helpers/logger';
import { structureCommentReturn, tsCommentSchema, userCommentObj } from '../tsModels/commentModels';

// Actualiza un comentario existente
export async function updateSingleComment({ id, commentText }: { id: string, commentText: string }): Promise<boolean> {
    if (!id || !commentText) return false;

    try {
        const result = await CommentSchema.updateOne({ _id: id }, { $set: { commentText } });
        return result.modifiedCount > 0;
    } catch (err) {
        logger.error(`Failed to update comment: ${err.message}`);
        throw err;
    }
}

// Añade un nuevo comentario
export async function addComment(commentData: userCommentObj): Promise<tsCommentSchema> {
    try {
        const commentObj: tsCommentSchema = {
            movieId: commentData.movieId,
            user: {
                userId: commentData.userId,
                userName: commentData.userName
            },
            commentText: commentData.commentText,
            depth: commentData.depth ?? 1,
            parentId: commentData.parentId ?? null
        };

        const comment = await new CommentSchema(commentObj).save();
        return comment;
    } catch (err) {
        logger.error(`Failed to add comment: ${err.message}`);
        throw err;
    }
}

// Obtiene los comentarios para una película
export async function getCommentsForPost(movieId: string): Promise<structureCommentReturn> {
    try {
        const commentsForMovie = await CommentSchema.find({ movieId }).lean().exec();

        const nests: { [key: string]: any } = {};

        const rec = (comment: any, threads: any) => {
            for (const thread in threads) {
                const value = threads[thread];

                if (thread.toString() === comment.parentId?.toString()) {
                    value.children[comment._id] = comment;
                    return;
                }
                if (value.children) {
                    rec(comment, value.children);
                }
            }
        };

        commentsForMovie.forEach((comment: any) => {
            comment.children = {};
            const parentId = comment.parentId;
            if (!parentId) {
                nests[comment._id] = comment;
            } else {
                rec(comment, nests);
            }
        });

        return {
            count: commentsForMovie.length,
            comments: nests
        };
    } catch (err) {
        logger.error(`Failed to get comments for movie ${movieId}: ${err.message}`);
        throw err;
    }
}
