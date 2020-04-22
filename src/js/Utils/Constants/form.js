export const FORM_FIELDS_LOGIN = {
    email: {
        help: 'Enter your email',
        error: 'Incorrect email or bad format!',
        autoCapitalize: 'none'
    },
    password: {
        help: 'Enter your password',
        error: 'Bad password or not allowed!',
        password: true,
        secureTextEntry: true
    }
};

export const FORM_FIELDS_REGISTER = {
    name: {
        help: 'Enter a nick name! 15 characters max',
        error: 'Bad characters. Allowed: Letters, numbers'
    },
    email: {
        help: 'Enter your email!',
        error: 'Incorrect email or bad format!',
        autoCapitalize: 'none'
    },

    password: {
        help: 'Enter your password',
        error: 'Bad password or not allowed!',
        password: true,
        secureTextEntry: true
    },

    password_confirmation: {
        help: 'Repeat your password ',
        error: 'The parameters doesn\'t match',
        password: true,
        secureTextEntry: true
    }
};
