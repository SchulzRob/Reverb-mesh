export const secondsToMMSS = seconds => {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    if (minutes < 10) {
		minutes = `0${minutes}`;
	}
    if (seconds < 10) {
		seconds = `0${seconds}`;
	}
    return `${minutes}:${seconds}`;
};
