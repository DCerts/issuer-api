import { Router } from 'express';
import { authorizeSchool, getAccountId } from '../utils/jwt';
import NewsService from '../services/news';


const router = Router();

router.get('/', async (req, res) => {
    await authorizeSchool(req);
    const accountId = getAccountId(req);
    const news = await NewsService.findNewsByAccountId(accountId);
    res.json(news);
});

export default router;