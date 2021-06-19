import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FORM_FIELDS_CREATE_GROUP } from '../../../src/js/Utils/constants/form';

const schema = yup.object().shape({
    name: yup.string()
        .trim()
        .min(5, ({ min }) => `El nombre del grupo ha de ser mayor que ${min} carácteres!`)
        .max(50)
        .required(FORM_FIELDS_CREATE_GROUP.group_name.error),
    description: yup.string().min(0).max(200).optional(),
    password: yup.string()
        .min(6, ({ min }) => `La contaseña tiene que ser de mínimo ${min} carácteres!`)
        .max(40)
        .optional()
        .notRequired()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Za-z])[A-Za-z\d]{6,40}$/, 'Contaseña incorrecta: la contraseña ha de tener almenos una letra y un número.'),
    confirm_password: yup.string().oneOf
        (
            [yup.ref('password'), null],
            FORM_FIELDS_CREATE_GROUP.group_password_confirm.error
        )
        .when('password', {
            is: (value: any) => {
                return !value;
            },
            then: yup.string().optional().notRequired(),
            otherwise: yup.string().required(FORM_FIELDS_CREATE_GROUP.group_password_confirm.error)
        })
});

function useGroupForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        register('name');
        register('description');
        register('password');
        register('confirm_password');
    }, [register]);

    return { handleSubmit, errors, errorText, isLoading, setValue, setIsLoading, setErrorText };
}

export default useGroupForm;
