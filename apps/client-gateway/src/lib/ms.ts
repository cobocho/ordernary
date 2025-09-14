import ms from 'ms';

export const durToSeconds = (v: string): number => {
	const msVal = ms(v as ms.StringValue); // "15m" -> 900000 (ms)
	if (typeof msVal !== 'number') throw new Error('Invalid duration: ' + v);
	return Math.floor(msVal / 1000); // -> 900 (seconds)
};
