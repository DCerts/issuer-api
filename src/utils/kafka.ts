import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';


dotenv.config();

const kafka = new Kafka({
    clientId: 'issuer-producer',
    brokers: [
        process.env.MESSAGE_BROKER_URL || ''
    ]
});

const producer = kafka.producer();

interface Message {
    key?: any,
    partition?: any,
    value: any
}

const sendMessages = async (topic: string, ...messages: Message[]) => {
    return producer.send({
        topic: topic,
        messages: messages
    });
};

const connect = async () => {
    await producer.connect();
};

export default producer;
export const KafkaUtils = {
    connect,
    sendMessages
};