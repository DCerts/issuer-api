import { Certificate } from './certificate';

interface Batch {
    regNo: string;
    onChainId?: number;
    group: number;
    creator: string;
    issued?: boolean;
    certificates: Certificate[];
}

export {
    Batch
};