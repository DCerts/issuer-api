import express, { Express } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { createAllTables, connect, createSchoolAccounts } from './utils/db';
import auth from './controllers/auth';
import account from './controllers/account';
import student from './controllers/student';
import subject from './controllers/subject';
import group from './controllers/group';
import { jwtFilter } from './utils/jwt';
import { httpErrorHandler, pathNotFoundHandler } from './errors/handler';
import logger from './utils/logger';


dotenv.config();

// Connect to the database then create tables if not exists.
(async () => {
    await connect();
    await createAllTables();
    await createSchoolAccounts();
})();


const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/account', jwtFilter, account);
app.use('/student', student);
app.use('/subject', subject);
app.use('/group', group);
app.use(pathNotFoundHandler);
app.use(httpErrorHandler);

app.listen(process.env.PORT, () => {
    logger.info(`Server started on port ${process.env.PORT}.`);
});