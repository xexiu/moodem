export function isEmpty(x) {
	return !x || (x.constructor !== Number && Object.keys(x).length === 0);
}