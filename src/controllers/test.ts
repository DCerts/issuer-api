import { Router } from 'express';
import Web3Service from '../services/web3';
import { KafkaUtils } from '../utils/kafka';


const router = Router();

router.get('/events/:eventName', async (req, res) => {
    const eventName = req.params.eventName;
    const result = await Web3Service.getEventsByName(eventName);
    res.json(result);
});

router.post('/messages/:topic', async (req, res) => {
    const topic = req.params.topic;
    res.json(await KafkaUtils.sendMessages(
        topic,
        req.body
    ));
});

export default router;