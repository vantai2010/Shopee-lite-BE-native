const fs = require('fs');
const path = require('path');


const handleDeleteImageFIle = (fileNames) => {
    const directoryPath = 'public/Images'
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(`Lỗi đọc thư mục: ${err}`);
            return;
        }

        files.forEach((file) => {
            if (fileNames.includes(file)) {
                const filePath = path.join(directoryPath, file);

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Không thể xóa tệp ${file}: ${err}`);
                    } else {
                        console.log(`Đã xóa tệp ${file}`);
                    }
                });
            }
        });
    });
}

module.exports = handleDeleteImageFIle