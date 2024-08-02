const yup = require('yup');

// Schema for user sign-up
const signUPSchema = yup.object().shape({
    name: yup.string()
        .required('Name is required')
        .matches(/^[A-Za-z\s]+$/, 'Name can only contain alphabetic characters and spaces'), // Allow spaces in names

    email: yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number') // Ensure at least one number
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

// Schema for user login
const LoginSchema = yup.object().shape({
    email: yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number') // Ensure at least one number
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

// Middleware to validate schemas
function validateSchema(schema) {
    return async (req, res, next) => {
        try {
            await schema.validate(req.body, { abortEarly: false });
            next(); // Validation passed, proceed to the next middleware or route handler
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                // Yup validation error
                const validationErrors = error.inner.map(err => ({
                    field: err.path,
                    message: err.message,
                }));
                return res.status(422).json({ errors: validationErrors });
            }
            next(error); // Forward other errors to the error handler middleware
        }
    };
}

module.exports = {
    signUPSchema,
    LoginSchema,
    validateSchema,
};
