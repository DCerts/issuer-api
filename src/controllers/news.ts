import { Router } from 'express';
import { JwtUtils } from '../utils/jwt';
import NewsService from '../services/news';


const router = Router();

router.get('/', async (req, res) => {
    await JwtUtils.authorizeSchool(req);
    const accountId = JwtUtils.getAccountId(req);
    const news = await NewsService.findNewsByAccountId(accountId);
    res.json(news);
});

export default router;