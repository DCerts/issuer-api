import IssuerRepository from '../repos/issuer';
import { BadRequestError, NotFoundError } from '../errors/http';
import { Issuer } from '../models/issuer';


const findByPublicAddress = async (publicAddress: string) => {
    const issuer = await IssuerRepository.findByPublicAddress(publicAddress);
    if (!issuer) {
        throw new NotFoundError('');
    }
    return issuer;
};

const createIssuer = async (issuer: Issuer) => {
    const issuerExists = await IssuerRepository.findByPublicAddress(issuer.id);
    if (issuerExists) {
        throw new BadRequestError('');
    }
    await IssuerRepository.create(issuer);
};

const updateIssuer = async (issuer: Issuer) => {
    await IssuerRepository.save(issuer);
};

export default {
    findByPublicAddress: findByPublicAddress,
    createIssuer: createIssuer,
    updateIssuer: updateIssuer
};