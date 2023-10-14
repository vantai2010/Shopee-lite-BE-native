const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        console.log(req)
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

module.exports = upload