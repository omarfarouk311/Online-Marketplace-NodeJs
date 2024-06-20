const fsPromises = require('fs').promises;
const crypto = require('crypto');

exports.storageEngine = multer.diskStorage({
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
        crypto.randomBytes(8, (err, buf) => {
            if (err) return cb(err);
            cb(null, `${buf.toString('hex')}_${file.originalname}`);
        });
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