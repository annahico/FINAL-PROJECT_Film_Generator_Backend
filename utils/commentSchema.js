const yup = require('yup');

const commentSchema = yup.object().shape({
    text: yup.string()
        .required('Comment is required')
        .min(1, 'Comment cannot be empty')  // Se asegura de que no esté vacío
        .matches(/^[A-Za-z0-9\s,.!]*$/, 'Comment can only contain letters, numbers, spaces, and punctuation'), // Permite letras, números, espacios y algunos signos de puntuación

    rating: yup.string()
        .required('Rating is required')
        .matches(/^[0-9]+$/, 'Rating must be a valid number') // Asegura que rating es un número, ajusta según sea necesario
});

module.exports = {
    commentSchema,
};
