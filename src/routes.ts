import { Router, Request, Response } from 'express';
import SendImageService from './services/sendImage.service';
import SendImageController from './controllers/sendImage.controller';

const router = Router();

const sendImageService = new SendImageService();
const sendImageController = new SendImageController(sendImageService);

router.get('/ping', (req: Request, res: Response) => {
    res.status(200).send("pong")
})

router.post('/upload', sendImageController.uploadImage)

export default router;

