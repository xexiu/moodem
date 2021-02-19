// eslint-disable-next-line one-var
const w = window,
	raf = w.requestAnimationFrame ||
	w.webkitRequestAnimationFrame ||
	w.mozRequestAnimationFrame ||
	w.msRequestAnimationFrame ||
	(cb => window.setTimeout(cb, 1000 / 60));

export default function doLater(cb, timeToWait) {
	if (timeToWait) {
		setTimeout(doLater.bind(null, cb), timeToWait);
	} else {
		raf(cb);
	}
}
