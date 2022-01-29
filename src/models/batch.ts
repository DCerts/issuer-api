import { Certificate } from './certificate';

interface Batch {
    id: number;
    name: string;
    group: number;
    creator: string;
    issued?: boolean;
    certificates: Certificate[];
}

export {
    Batch
};