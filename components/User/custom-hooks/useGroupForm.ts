import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

const schema = yup.object().shape({
    name: yup.string()
        .trim()
        .min(5, ({ min }) => `${translate('groups.settings.formErrors.2')} ${min} ${translate('groups.settings.formErrors.3')}`)
        .max(50)
        .required(() => translate('groups.settings.formErrors.1')),
    description: yup.string().min(0).max(200).optional(),
    password: yup.string()
        .min(6, ({ min }) => `${translate('groups.settings.formErrors.4')} ${min} ${translate('groups.settings.formErrors.3')}`)
        .max(40)
        .optional()
        .notRequired()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Za-z])[A-Za-z\d]{6,40}$/, () => translate('groups.settings.formErrors.0')),
    confirm_password: yup.string().oneOf
        (
            [yup.ref('password'), null],
            () => translate('groups.settings.formErrors.5')
        )
        .when('password', {
            is: (value: any) => {
                return !value;
            },
            then: yup.string().optional().notRequired(),
            otherwise: yup.string().required(() => translate('groups.settings.formErrors.5'))
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
