import { EventData } from 'web3-eth-contract';
import { EVENT_GROUP_CONFIRMED } from '../../commons/contract';
import { getContract } from '../../utils/eth';
import logger from '../../utils/logger';
import Web3GroupService from './group';


const getEventsByName = async (eventName: string) => {
    const contract = await getContract();
    const events = await contract.getPastEvents(eventName, {
        fromBlock: 0,
        toBlock: 'latest'
    });
    return events.map(event => event.returnValues);
};

const listenEvents = async () => {
    const contract = await getContract();
    contract.events.allEvents({
        fromBlock: 0
    }, async (err: any, e: EventData) => {
        if (err) logger.error(err);
        else if (e) {
            logger.info(`${e.event} ${JSON.stringify(e.returnValues, null, 2)}`);
            if (e.event === EVENT_GROUP_CONFIRMED) {
                await Web3GroupService.processGroupConfirmed(e);
            }
        }
    }).on('connected', (id: any) => {
        logger.info(`Listening to all events from subscription ${id}.`);
    });
};

listenEvents();

export default {
    getEventsByName: getEventsByName,
};