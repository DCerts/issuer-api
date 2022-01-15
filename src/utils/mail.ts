import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { EMPTY } from '../commons/str';


dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number.parseInt(process.env.MAIL_PORT || EMPTY),
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendMail = (options: {
    to: string;
    subject: string;
    text: string;
}, callback?: Function) => {
    transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to: options.to,
        subject: options.subject,
        text: options.text
    }, (err, info) => {
        if (callback) callback(err, info);
    });
};

const sendHtml = (options: {
    to: string;
    subject: string;
    html: string;
}, callback?: Function) => {
    transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to: options.to,
        subject: options.subject,
        html: options.html
    }, (err, info) => {
        if (callback) callback(err, info);
    });
};

export default transporter;
export {
    sendMail,
    sendHtml
};

