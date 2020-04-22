import { refinement, String } from 'tcomb-form-native';

export const formValidation = {
	name: refinement(String, (s) => /\w+[\s]?\w+/.test(s) && s.length <= 15),
	email: refinement(String, (s) => /@/.test(s)),
	password: refinement(String, (s) => s.length >= 6)
};
