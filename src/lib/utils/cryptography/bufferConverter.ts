export const bufferToBase64 = (buffer: any) => btoa(String.fromCharCode(...new Uint8Array(buffer)));

export const base64ToBuffer = (base64: string) => {
	const binary = atob(base64);
	const buffer = new Uint8Array(binary.length);

	for (let i = 0; i < binary.length; i++) {
		buffer[i] = binary.charCodeAt(i);
	}

	return buffer.buffer;
};
