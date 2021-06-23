/* eslint-disable max-len */
import { refinement, String, maybe } from 'tcomb-form-native';

export const formValidation = {
	name: refinement(String, (s) => /\w+[\s]?\w+/.test(s) && s.length <= 15),
	email: refinement(String, (s) => /@/.test(s)),
	password: refinement(String, (s) => s.length >= 6 && s.length <= 30)
};

export const formValidationGroup = {
	group_name: refinement(String, (s) => /^(?!.*\/\/)[A-Za-z0-9][A-Za-z0-9_-]*$/.test(s) && s.length <= 30),
	group_password: refinement(String, (s) => s.length >= 4 && s.length <= 30 && /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(s)),
	invited_emails: maybe(refinement(String, (s) => /.*?@.*?\..*?,?/.test(s) && s.length <= 400)) // TO-DO --> Test regex exaustly
};
