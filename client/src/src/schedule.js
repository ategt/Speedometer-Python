import './decorate-number-pad';

export const prettyTime = function (seconds) {
	return `${Math.floor(seconds/60)}:${(seconds%60).pad(2)}`;
};
