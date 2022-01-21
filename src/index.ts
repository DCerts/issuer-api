import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseUtils } from './utils/db';
import auth from './controllers/auth';
import account from './controllers/account';
import student from './controllers/student';
import subject from './controllers/subject';
import group from './controllers/group';
import news from './controllers/news';
import test from './controllers/test';
import { JwtUtils } from './utils/jwt';
import { ErrorHandlers } from './errors/handler';
import logger from './utils/logger';


dotenv.config();

// Connect to the database then create tables if not exists.
(async () => {
    await DatabaseUtils.connect();
    await DatabaseUtils.createAllTables();
})();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/accounts', JwtUtils.jwtFilter, account);
app.use('/students', JwtUtils.jwtFilter, student);
app.use('/subjects', JwtUtils.jwtFilter, subject);
app.use('/groups', JwtUtils.jwtFilter, group);
app.use('/news', JwtUtils.jwtFilter, news);
app.use('/test', test);
app.use(ErrorHandlers.pathNotFoundHandler);
app.use(ErrorHandlers.httpErrorHandler);

app.listen(process.env.PORT, () => {
    logger.info(`Server started on port ${process.env.PORT}.`);
});