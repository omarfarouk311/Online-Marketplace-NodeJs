const fsPromises = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { diskStorage } = require('multer');

exports.storageEngine = diskStorage({
    destination: async (req, file, cb) => {
        try {
            await fsPromises.mkdir('public/images', { recursive: true });
            cb(null, 'public/images');
        }
        catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}_${file.originalname}`);
    }
});

exports.fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
        req.invalidFileType = true;
    }
}