import multer from 'multer';
import s3 from '../config/awsConfig';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Request } from 'express';
import RabbitMqConfig from '../config/rabbitmqConfig';
import dotenv from 'dotenv';
dotenv.config();


class SendImageService {
    private upload: multer.Multer;
    private rabbitMqConfig: RabbitMqConfig;

    constructor(rabbitMqConfig: RabbitMqConfig) {
        this.rabbitMqConfig = rabbitMqConfig;

        const storage = multer.memoryStorage()

        this.upload = multer({
            storage: storage,
            limits: { fileSize: 5 * 1024 * 1024 }
        })
    }

    public uploadImage(req: Request): Promise<{ imageId: string, location: string }> {
        return new Promise((resolve, reject) => {
            const uploadSingle = this.upload.single('image')

            uploadSingle(req, null, async (err) => {
                if (err) {
                    return reject(err)
                }
                if (!req.file) {
                    return reject(new Error('Nenhuma imagem enviada'))
                }

                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
                const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();

                if(!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
                    return reject(new Error('Formato de arquivo inválido'))
                }

                try {
                    console.log("PROCESSO DE ENVIO DA IMAGEM ORIGINAL PARA O S3")

                    const fileName = `${Date.now()}-${req.file.originalname}`
                    const params = {
                        Bucket: String(process.env.AWS_BUCKET_NAME),
                        Key: fileName,
                        Body: req.file.buffer,
                        ContentType: req.file.mimetype
                    }

                    const command = new PutObjectCommand(params);
                    await s3.send(command);

                    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

                    const imageData = {
                        imageId: fileName,
                        location: fileUrl
                    }

                    await this.rabbitMqConfig.sendToQueue(imageData)
    
                    resolve(imageData)
                    console.log("IMAGEM ENVIADA")
                } catch (error) {
                    console.log("ERRO NO ENVIO DA IMAGEM ORIGINAL AO S3: ", error)
                    reject(error)
                }
            })
        })
    }
}

export default SendImageService;


