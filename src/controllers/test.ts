import { Router } from 'express';
import Web3Service from '../services/web3';
import TestService from '../services/test';


const router = Router();

router.get('/events/:eventName', async (req, res) => {
    const eventName = req.params.eventName;
    const result = await Web3Service.getEventsByName(eventName);
    res.json(result);
});

router.get('/auth/:publicAddress', async (req, res) => {
    const publicAddress = req.params.publicAddress;
    const token = await TestService.generateToken(publicAddress);
    res.json(token);
});

export default router;