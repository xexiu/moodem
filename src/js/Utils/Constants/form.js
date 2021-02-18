/* eslint-disable max-len */
export const FORM_FIELDS_LOGIN = {
    email: {
        help: 'Ingresa tu e-mail',
        error: 'E-mail incorrecto o inválido!',
        autoCapitalize: 'none'
    },
    password: {
        help: 'Ingresa tu contraseña',
        error: 'Contraseña incorrecta!',
        password: true,
        secureTextEntry: true
    }
};

export const FORM_FIELDS_REGISTER = {
    name: {
        help: 'Ingresa un nickname! 30 carácteres max',
        error: 'Carácteres incorectos. Permitidos: Letras, números'
    },
    email: {
        help: 'Ingresa tu e-mail!',
        error: 'E-mail incorrecto o inválido!',
        autoCapitalize: 'none'
    },

    password: {
        help: 'Ingresa tu contraseña! (min. 6 charácteres)',
        error: 'Contraseña incorrecta!',
        password: true,
        secureTextEntry: true
    },

    confirmar_password: {
        help: 'Repite tu contraseña ',
        error: 'Las contraseñas no coinciden',
        password: true,
        secureTextEntry: true
    }
};

export const FORM_FIELDS_CREATE_GROUP = {
    group_name: {
        help: 'Ingresar un nombre de grupo (Permitidos: letras y/o números o carácteres _-!)',
        error: 'Nombre del grupo incorrecto o no permitido!'
    },
    group_password: {
        help: 'Ingresa una contraseña para tú grupo. (contraseña mínima de 4 carácteres y ha de contener una letra)',
        error: 'Contraseña no permitida! (contraseña mínima de 4 carácteres y ha de contener una letra)',
        password: true,
        secureTextEntry: true
    }
    // ,
    // invited_emails: {
    //     multiline: true,
    //     numberOfLines: 10,
    //     help: 'Enter emails to invite, followed by commas. (Ex: foo@bar.com,dummy@hey.com)',
    //     error: 'Bad email or not allowed! (Ex: foo@bar.com,dummy@hey.com)',
    //     autoCapitalize: 'none',
    //     autoCorrect: false
    // }
};
