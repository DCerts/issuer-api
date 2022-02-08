import { EventData } from 'web3-eth-contract';
import EthUtils from '../../utils/eth';
import logger from '../../utils/logger';
import Web3AccountService from './account';
import Web3GroupService from './group';
import Web3BatchService from './batch';
import Web3CertificateService from './certificate';
import {
    EVENT_WALLET_ACTIVATED,
    EVENT_GROUP_PENDING, EVENT_GROUP_ADDED, EVENT_GROUP_REMOVED,
    EVENT_GROUP_CONFIRMED, EVENT_GROUP_REJECTED,
    EVENT_BATCH_ADDED, EVENT_BATCH_CONFIRMED, EVENT_BATCH_PENDING,
    EVENT_CERT_ADDED, EVENT_CERT_CONFIRMED, EVENT_CERT_PENDING
} from '../../commons/contract';


const getEventsByName = async (eventName: string) => {
    const contract = await EthUtils.getContract();
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
    if (e.event === EVENT_GROUP_REJECTED) {
        return Web3GroupService.processGroupRejected(e);
    }
    if (e.event === EVENT_GROUP_PENDING) {
        return Web3GroupService.processGroupPending(e);
    }
    if (e.event === EVENT_GROUP_ADDED) {
        return Web3GroupService.processGroupAdded(e);
    }
    if (e.event === EVENT_GROUP_REMOVED) {
        return Web3GroupService.processGroupRemoved(e);
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
    if (e.event === EVENT_CERT_CONFIRMED) {
        return Web3CertificateService.processCertificateConfirmed(e);
    }
    if (e.event === EVENT_CERT_PENDING) {
        return Web3CertificateService.processCertificatePending(e);
    }
    if (e.event === EVENT_CERT_ADDED) {
        return Web3CertificateService.processCertificateAdded(e);
    }
};

let connected = false;

const listenEvents = async () => {
    const contract = await EthUtils.getContract();
    contract.events.allEvents({
        fromBlock: 0
    }, (err: any, e: EventData) => {
        if (err) {
            logger.error(err);
            EthUtils.reconnect();
            listenEvents();
        }
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