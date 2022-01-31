import { Router } from 'express';
import { JwtUtils } from '../utils/jwt';
import NewsService from '../services/news';


const router = Router();

router.get('/:newsType', async (req, res) => {
    await JwtUtils.authorizeSchool(req);
    const newsType = req.params.newsType;
    const accountId = JwtUtils.getAccountId(req);
    const news = await NewsService.findNewsByAccountId(newsType, accountId);
    res.json(news);
});

export default router;