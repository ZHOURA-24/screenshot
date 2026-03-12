/// <reference types="axios" />
/// <reference types="form-data" />
const { Image } = require('image-js');
const axios = require('axios');
let FormData = require('form-data');

async function removeGreenScreen(inputPath) {
  const image = await Image.load(inputPath)

  const width = image.width
  const height = image.height
  const newImage = new Image(width, height, { kind: 'RGBA' })

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = image.getPixelXY(x, y)

      const isGreenScreen =
        g > r + 20 && g > b + 20 && g > 100 && r < 120 && b < 120

      if (isGreenScreen) {
        newImage.setPixelXY(x, y, [0, 0, 0, 0])
      } else {
        newImage.setPixelXY(x, y, [r, g, b, 255])
      }
    }
  }

  return newImage.toDataURL()
}

exports('RemoveGreenScreen', removeGreenScreen);

async function uploadScreenshot(url, headers, screenshotData, fields) {
	try {
		const buffer = Buffer.from(screenshotData.split(',')[1], 'base64');
		const formData = new FormData();

		formData.append(fields || 'file', buffer, { filename: 'image.png' });

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
