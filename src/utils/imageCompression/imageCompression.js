const sharp = require('sharp');
const getImageFormat = require("./getImageFormat")

const compressImage = (base64Data, options) => {
    const typeImage = getImageFormat(base64Data)
    const options = {
        quality: 70, // Chất lượng JPEG (0-100)
        width: 800,  // Chiều rộng mới
        height: 600   // Chiều cao mới
    };
    const buffer = Buffer.from(base64Data, 'base64');

    sharp(buffer)
        .resize(options.width, options.height)
        .toBuffer()
        .then((compressedBuffer) => {
            // Chuyển ảnh nén thành chuỗi Base64 mới
            const compressedBase64 = compressedBuffer.toString('base64');

            return compressedBase64
        })
        .catch((error) => {
            console.error('Error compressing image: ', error);
        });
}

module.exports = compressImage;
