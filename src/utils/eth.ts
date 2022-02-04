import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import dotenv from 'dotenv';
import { bufferToHex } from 'ethereumjs-util';
import { recoverPersonalSignature } from 'eth-sig-util';
import MultiSigWallet from '../contracts/MultiSigWallet.json';


dotenv.config();

interface ContractJSON {
    abi: any[];
    networks: {
        [networkId: number]: {
            address: string;
        };
    };
}

const getWeb3 = () => {
    return new Web3(`${process.env.WEB3_PROVIDER}`);
};

let web3 = getWeb3();

/**
 * Returns instance of the contract MultiSigWallet.
 * @returns the instance
 */
const getContract = async () => {
    let contract: Contract;
    const contractJSON: ContractJSON = {
        abi: MultiSigWallet.abi,
        networks: MultiSigWallet.networks
    };
    const netId = await web3.eth.net.getId();
    const abi = contractJSON.abi;
    const address = contractJSON.networks[netId].address;
    contract = new web3.eth.Contract(abi, address);
    return contract;
};

const reconnect = () => {
    web3 = getWeb3();
};

/**
 * Validates the signature of a given message.
 */
const isSignatureValid = (
    message: string,
    publicAddress: string,
    signature: string
): boolean => {
    const hex = bufferToHex(Buffer.from(message, 'utf-8'));
    const address = recoverPersonalSignature({
        data: hex,
        sig: signature
    });

    return address.toLowerCase() === publicAddress.toLowerCase();
};

export default {
    reconnect,
    getContract,
    isSignatureValid
};