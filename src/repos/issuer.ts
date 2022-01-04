import Repository from './base';
import { SQL } from '../utils/db';
import { Issuer } from '../models/issuer';


class IssuerRepository extends Repository {
    private findByPublicAddressSQL: string;

    constructor() {
        super();
        this.findByPublicAddressSQL = SQL.from('select-from/issuers/by-public-address.sql').build();
    }

    async findByPublicAddress(publicAddress: string) {
        const result = await this.db?.get(this.findByPublicAddressSQL, [publicAddress]);
        if (result) {
            return {
                id: result['public_address'],
                name: result['full_name'],
                email: result['email']
            };
        }
    }
}

export default new IssuerRepository();