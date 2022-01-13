import express, { Express } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { createAllTables, connect } from './utils/db';
import auth from './controllers/auth';
import account from './controllers/account';
import { jwtFilter } from './utils/jwt';
import errorHandler from './errors/handler';


dotenv.config();

// Connect to the database then create tables if not exists.
const setup = async () => {
    await connect();
    createAllTables();
};

setup();


const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/account', jwtFilter, account);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Application is running on port ${process.env.PORT}...`);
});