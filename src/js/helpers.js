/**
	From https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Math/random

	Returns a random number between min and max
 */
function getRandomArbitary (min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function boundingCircleCollisionCheck(r1, p1, r2, p2) {
	var rsum = r1 + r2;

	return rsum * rsum > p1.distanceToSquared(p2);
}
