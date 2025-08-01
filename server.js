/// <reference types="axios" />
/// <reference types="form-data" />
const { Image } = require('image-js');
const axios = require('axios');
let FormData = require('form-data');

async function removeGreenScreen(inputPath) {
	const image = await Image.load(inputPath);

	image.resize({
		width: image.width,
		height: image.height,
		fill: 'transparent',
	});

	image.data.forEach((_, index) => {
		const r = image.data[index * 4];
		const g = image.data[index * 4 + 1];
		const b = image.data[index * 4 + 2];

		if (r < 100 && g > 150 && b < 100) {
			image.data[index * 4 + 3] = 0;
		}
	});

	return image.toDataURL();
}

exports('RemoveGreenScreen', removeGreenScreen);

async function uploadScreenshot(url, headers, screenshotData) {
	try {
		const buffer = Buffer.from(screenshotData.split(',')[1], 'base64');
		const formData = new FormData();

		formData.append('file', buffer, { filename: 'image.png' });

		const response = await axios.post(url, formData, {
			headers: headers,
		});

		if (response.status === 200) {
			return response.data;
		}

		throw new Error(`Upload failed with status code: ${response.status}`);
	} catch (error) {
		console.error('Error uploading screenshot:', error);
		throw error;
	}
}

exports('UploadScreenshot', uploadScreenshot);
