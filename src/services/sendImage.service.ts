import multer from 'multer';
import { Request } from 'express';


class SendImageService {
    private upload: multer.Multer;

    constructor() {
        const storage = multer.memoryStorage()

        this.upload = multer({
            storage: storage,
            limits: { fileSize: 5 * 1024 * 1024 }
        })
    }

    public uploadImage(req: Request): Promise<Express.Multer.File> {
        return new Promise((resolve, reject) => {
            const uploadSingle = this.upload.single('image')

            uploadSingle(req, null, (err) => {
                if (err) {
                    return reject(err)
                }
                if (!req.file) {
                    return reject(new Error('Nenhuma imagem enviada'))
                }
                resolve(req.file)
            })
        })
    }
}

export default SendImageService;


