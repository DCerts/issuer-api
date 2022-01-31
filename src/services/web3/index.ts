import { EventData } from 'web3-eth-contract';
import { getContract } from '../../utils/eth';
import logger from '../../utils/logger';
import Web3AccountService from './account';
import Web3GroupService from './group';
import Web3BatchService from './batch';
import Web3CertificateService from './certificate';
import {
    EVENT_WALLET_ACTIVATED,
    EVENT_GROUP_ADDED, EVENT_GROUP_CONFIRMED, EVENT_GROUP_PENDING,
    EVENT_BATCH_ADDED, EVENT_BATCH_CONFIRMED, EVENT_BATCH_PENDING,
    EVENT_CERT_PENDING
} from '../../commons/contract';


const getEventsByName = async (eventName: string) => {
    const contract = await getContract();
    const events = await contract.getPastEvents(eventName, {
        fromBlock: 0,
        toBlock: 'latest'
    });
    return events.map(event => event.returnValues);
};

const processWalletActivated = async (e: EventData) => {
    if (e.event === EVENT_WALLET_ACTIVATED) {
        return Web3AccountService.processWalletActivated(e);
    }
};

const processGroupEvents = async (e: EventData) => {
    if (e.event === EVENT_GROUP_CONFIRMED) {
        return Web3GroupService.processGroupConfirmed(e);
    }
    if (e.event === EVENT_GROUP_PENDING) {
        return Web3GroupService.processGroupPending(e);
    }
    if (e.event === EVENT_GROUP_ADDED) {
        return Web3GroupService.processGroupAdded(e);
    }
};

const processBatchEvents = async (e: EventData) => {
    if (e.event === EVENT_BATCH_CONFIRMED) {
        return Web3BatchService.processBatchConfirmed(e);
    }
    if (e.event === EVENT_BATCH_PENDING) {
        return Web3BatchService.processBatchPending(e);
    }
    if (e.event === EVENT_BATCH_ADDED) {
        return Web3BatchService.processBatchAdded(e);
    }
};

const processCertificateEvents = async (e: EventData) => {
    if (e.event === EVENT_CERT_PENDING) {
        return Web3CertificateService.processCertificatePending(e);
    }
};

const listenEvents = async () => {
    const contract = await getContract();
    contract.events.allEvents({
        fromBlock: 0
    }, (err: any, e: EventData) => {
        if (err) logger.error(err);
        else if (e) {
            logger.info(`${e.event} ${JSON.stringify(e.returnValues, null, 2)}`);

            processCertificateEvents(e);
            processBatchEvents(e);
            processGroupEvents(e);

            // processing other events...

            processWalletActivated(e);
        }
    }).on('connected', (id: any) => {
        logger.info(`Listening to all events from subscription ${id}.`);
    });
};

listenEvents();

export default {
    getEventsByName
};