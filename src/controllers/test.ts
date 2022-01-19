import { Router } from 'express';
import Web3Service from '../services/web3';


const router = Router();

router.get('/:eventName', async (req, res) => {
    const eventName = req.params.eventName;
    const result = await Web3Service.getEventsByName(eventName);
    res.json(result);
});

export default router;