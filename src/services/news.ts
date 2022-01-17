import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
import { NotFoundError } from '../errors/http';
import NewsRepository from '../repos/news';


const findNewsByAccountId = async (accountId: string) => {
    const news = await NewsRepository.findByAccountId(accountId);
    if (!news) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    return news;
};

export default {
    findNewsByAccountId: findNewsByAccountId
};