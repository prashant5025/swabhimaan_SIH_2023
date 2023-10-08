const path = require('path');
const multer = require('multer');

const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/profilePicture'));
    },
    filename: (req, file, cb) => {
        cb(null, Data.now() + path.extname(file.originalname));
    }
});

const profileCoverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profileCover');
    },
    filename: (req, file, cb) => {
        cb(null, Data.now() + path.extname(file.originalname));
    }
});

const uploadProfilePicture = multer({
    storage: profilePictureStorage,
    fileFilter: ( req, file, cb ) => { 
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Only jpg, jpeg and png files are allowed'), false);
        }
        cb(null, true);
    }
}).single('profilePicture');
const uploadCoverPicture = multer({
    storage: profileCoverStorage,
    fileFilter: ( req, file, cb ) => { 
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Only jpg, jpeg and png files are allowed'), false);
        }
        cb(null, true);
    }
}).single('profileCover');

module.exports = {
    uploadProfilePicture,
    uploadCoverPicture
}

