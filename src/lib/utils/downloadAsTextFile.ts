/**
 * download something as file
 *
 * @see https://flexiple.com/javascript/download-flle-using-javascript/
 */
export function downloadAsTextFile(data: string, filename: string, type: string) {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');

	a.href = url;
	a.download = filename;
	a.click();

	URL.revokeObjectURL(url);
	a.remove();
}
