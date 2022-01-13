import express, { Express } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { createTables, connect } from './utils/db';
import auth from './controllers/auth';
import account from './controllers/account';
import issuer from './controllers/issuer';
import student from './controllers/student';
import subject from './controllers/subject';
import { jwtFilter } from './utils/jwt';
import errorHandler from './errors/handler';


dotenv.config();

// Connect to the database then create tables if not exists.
const setup = async () => {
    await connect();
    createTables('accounts', 'issuers', 'students', 'subjects', 'certs', 'cert-issuers');
};

setup();


const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/account', account);
app.use('/issuer', jwtFilter, issuer);
app.use('/student', jwtFilter, student);
app.use('/subject', jwtFilter, subject);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Application is running on port ${process.env.PORT}...`);
});