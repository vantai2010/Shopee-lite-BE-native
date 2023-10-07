const getImageFormat = (base64String) => {
    // Kiểm tra byte đầu tiên của chuỗi Base64
    const header = base64String.substring(0, 30); // Lấy 30 ký tự đầu tiên

    if (header.includes('image/jpeg')) {
        return 'jpeg';
    } else if (header.includes('image/png')) {
        return 'png';
    } else if (header.includes('image/gif')) {
        return 'gif';
    } else if (header.includes('image/webp')) {
        return 'webp';
    } else {
        return 'unknown';
    }

}

module.exports = getImageFormat
