import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
import { NotFoundError } from '../errors/http';
import { NewsType } from '../models/news';
import NewsRepository from '../repos/news';


const findNewsByAccountId = async (newsType: string, accountId: string) => {
    let news;
    switch (newsType) {
        case NewsType.GROUP_CREATED:
            news = await NewsRepository.findGroupCreatedNewsByAccountId(accountId);
            break;
        case NewsType.BATCH_CREATED:
            news = await NewsRepository.findBatchCreatedNewsByAccountId(accountId);
            break;
    }
    if (!news) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    return news;
};

export default {
    findNewsByAccountId: findNewsByAccountId
};