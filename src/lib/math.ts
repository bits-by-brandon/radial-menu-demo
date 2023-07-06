export function polarToCartesian(r: number, theta: number) {
	return {
		x: r * Math.cos(theta),
		y: r * Math.sin(theta)
	};
}

export function cartesianToPolar(x: number, y: number) {
	return {
		r: Math.sqrt(x * x + y * y),
		theta: Math.atan2(y, x)
	};
}

export function getDistance(x1: number, y1: number, x2: number, y2: number) {
	const y = x2 - x1;
	const x = y2 - y1;
	return Math.sqrt(x * x + y * y);
}

export function getAngle(x1: number, y1: number, x2: number, y2: number) {
	const dy = y2 - y1;
	const dx = x2 - x1;
	return Math.atan2(dy, dx) + Math.PI; // range [-PI, PI]
}
