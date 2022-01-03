import express, { Express } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './services/auth';
import issuer from './services/issuer';
import { jwtFilter } from './utils/jwt';
import errorHandler from './errors/handler';


dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/issuer', jwtFilter, issuer);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Application is running on port ${process.env.PORT}...`);
});