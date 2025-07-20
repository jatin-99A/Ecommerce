import multer from "multer";
import {v4 as uuid} from "uuid";

const storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, "uploads");
    },
    filename(req, file, callback){
        const extName = file.originalname.split('.').pop();
        const fileName = `${uuid()}.${extName}`;
        callback(null, fileName);
    },
});

export const multipleUpload = multer({ storage }).array("photos", 6); 
