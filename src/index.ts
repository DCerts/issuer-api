import express, { Express } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { createTables, connect } from './utils/db';
import auth from './controllers/auth';
import issuer from './controllers/issuer';
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
app.use('/issuer', jwtFilter, issuer);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Application is running on port ${process.env.PORT}...`);
});