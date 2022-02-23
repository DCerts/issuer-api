import Web3Service from '../services/web3/index';

const connect = async () => {
    await Web3Service.listenEvents();
};

export const Web3Utils = {
    connect
};
