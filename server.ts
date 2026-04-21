import { Image, ImageKind } from 'image-js';
import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';

async function removeGreenScreen(inputPath: string): Promise<string> {
	const image: Image = await Image.load(inputPath);

	const width: number = image.width;
	const height: number = image.height;
	const newImage: Image = new Image({ width, height, kind: 'RGBA' as ImageKind });

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const [r, g, b]: number[] = image.getPixelXY(x, y);

			const isGreenScreen: boolean =
				g > r + 20 && g > b + 20 && g > 100 && r < 120 && b < 120;

			if (isGreenScreen) {
				newImage.setPixelXY(x, y, [0, 0, 0, 0]);
			} else {
				newImage.setPixelXY(x, y, [r, g, b, 255]);
			}
		}
	}

	return newImage.toDataURL();
}

exports('RemoveGreenScreen', removeGreenScreen);

async function uploadScreenshot(
	url: string,
	headers: Record<string, string>,
	screenshotData: string,
	fields?: string,
	attempt: number = 1,
): Promise<unknown> {
	try {
		const base64Data: string = screenshotData.split(',')[1];
		const buffer: Buffer = Buffer.from(base64Data, 'base64');
		const formData: FormData = new FormData();

		formData.append(fields || 'file', buffer, { filename: 'image.png' });

		const config: AxiosRequestConfig = {
			headers: {
				...headers,
				...formData.getHeaders(),
			},
			timeout: 60000,
		};

		const response = await axios.post(url, formData, config);

		return response.data;
	} catch (error: unknown) {
		const err = error as { code?: string; message?: string };
		if (err.code === 'ECONNABORTED' && attempt < 5) {
			await new Promise((resolve: (value: number) => void) =>
				setTimeout(resolve, 500 * attempt),
			);
			return uploadScreenshot(
				url,
				headers,
				screenshotData,
				fields,
				attempt + 1,
			);
		}

		console.error('Error uploading screenshot:', err.message);
		throw error;
	}
}

exports('UploadScreenshot', uploadScreenshot);
