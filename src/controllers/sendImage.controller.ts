import { Request, Response } from "express";
import SendImageService from "../services/sendImage.service";

class SendImageController {
    private sendImageService: SendImageService;

    constructor(sendImageService: SendImageService) {
        this.sendImageService = sendImageService;

        this.uploadImage = this.uploadImage.bind(this);
    }

    async uploadImage(req: Request, res: Response): Promise<void> {
        try {
            const uploadFile = await this.sendImageService.uploadImage(req)

            res.status(200).json({
                message: 'Arquivo recebido com sucesso',
                fileName: uploadFile.originalname
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }
}

export default SendImageController;