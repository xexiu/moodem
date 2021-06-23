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
        help: 'Ingresa tu contraseña! (min. 6 carácteres)',
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
        help: 'Ingresar un nombre de grupo. (max. 50 carácteres)',
        error: 'Nombre del grupo incorrecto o no permitido!'
    },
    group_password: {
        help: 'Min. 6 carácteres. Letra(s) y número(s).',
        error: 'Contraseña no permitida! Contraseña mínima de 6 carácteres y ha de contener letra(s) y número(s)',
        password: true,
        secureTextEntry: true
    },
    group_password_confirm: {
        help: 'Repite tu contraseña ',
        error: 'Las contraseñas no coinciden',
        password: true,
        secureTextEntry: true
    },
    group_description: {
        help: 'Añade una descripción para tu grupo (opcional). La descripción no puede exceder más de 200 carácteres!',
        error: 'La descripción introducida no es válida.',
        numberOfLines: 5,
        multiline: true,
        autoCapitalize: 'none',
        autoCorrect: false
    }
};
