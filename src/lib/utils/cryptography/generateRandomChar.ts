const generateRandomChar = (length: number = 16, withoutLowerCase: boolean = false) => {
	const numeric = '1234567890';
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';

	const character = random(numeric + alphabet.toUpperCase() + (withoutLowerCase ? '' : alphabet));

	return new Array(length)
		.fill(0)
		.map(() => character.charAt(Math.floor(Math.random() * character.length)))
		.join('');
};

function random(string: string) {
	const arrayOfString = string.split('');

	for (let currentIndex = arrayOfString.length; currentIndex >= 0; currentIndex--) {
		const randomIndex = Math.ceil(Math.random() * currentIndex);

		[arrayOfString[currentIndex], arrayOfString[randomIndex]] = [
			arrayOfString[randomIndex],
			arrayOfString[currentIndex],
		];
	}

	return arrayOfString.join('');
}

export { generateRandomChar };
