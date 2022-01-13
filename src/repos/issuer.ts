import Repository from './base';
import { SQL } from '../utils/db';
import { Issuer } from '../models/issuer';


class IssuerRepository extends Repository {
    private findByPublicAddressSQL: string;
    private createWithPublicAddressSQL: string;
    private createWithPublicAddressAndFullNameAndEmailSQL: string;
    private saveByPublicAddressSQL: string;

    constructor() {
        super();
        this.findByPublicAddressSQL = SQL.from('select-from/issuers/by-public-address.sql').build();
        this.createWithPublicAddressSQL = SQL.from('insert-into/issuers/with-public-address.sql').build();
        this.createWithPublicAddressAndFullNameAndEmailSQL = SQL.from('insert-into/issuers/with-public-address-with-full-name-with-email.sql').build();
        this.saveByPublicAddressSQL = SQL.from('update/issuers/by-public-address-with-full-name-with-email.sql').build();
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

    async create(issuer: Issuer) {
        await this.db?.run(
            this.createWithPublicAddressAndFullNameAndEmailSQL,
            [issuer.id, issuer.name, issuer.email]
        );
    }

    async save(issuer: Issuer) {
        await this.db?.run(
            this.saveByPublicAddressSQL,
            [issuer.name, issuer.email, issuer.id]
        );
    }
}

export default new IssuerRepository();