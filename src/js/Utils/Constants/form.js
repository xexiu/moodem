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

export const FORM_FIELDS_CREATE_GROUP = {
    group_name: {
        help: 'Enter a group name (letters/numbers and _- characters allwowed only!)',
        error: 'Incorrect group name!',
        autoCapitalize: 'none'
    },
    group_password: {
        help: 'Enter group password. (mininum length must be 4 or greater)',
        error: 'Bad password or not allowed! (mininum length must be 4 or greater)',
        password: true,
        secureTextEntry: true
    },
    invited_emails: {
        help: 'Enter emails to invite, followed by commas. (Ex: foo@bar.com,dummy@hey.com)',
        error: 'Bad email or not allowed! (Ex: foo@bar.com,dummy@hey.com)'
    }
};
