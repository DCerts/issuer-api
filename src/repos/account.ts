import Repository from './base';
import { SQL } from '../utils/db';
import { Account } from '../models/account';


class AccountRepository extends Repository {
    private findByPublicAddressSQL: string;
    private createWithPublicAddressAndNonceSQL: string;
    private saveWithPublicAddressAndNonceSQL: string;

    constructor() {
        super();
        this.findByPublicAddressSQL = SQL.from('select-from/accounts/by-public-address.sql').build();
        this.createWithPublicAddressAndNonceSQL
            = SQL.from('insert-into/accounts/with-public-address-with-nonce.sql').build();
        this.saveWithPublicAddressAndNonceSQL
            = SQL.from('update/accounts/by-public-address-with-nonce.sql').build();
    }

    async findByPublicAddress(publicAddress: string) {
        const result = await this.db?.get(this.findByPublicAddressSQL, [publicAddress]);
        if (result) {
            return {
                publicAddress: result['public_address'],
                role: result['role'],
                nonce: result['nonce'],
            };
        }
    }

    async create(account: Account) {
        await this.db?.run(
            this.createWithPublicAddressAndNonceSQL,
            [account.publicAddress, account.nonce]
        );
    }

    async save(account: Account) {
        await this.db?.run(this.saveWithPublicAddressAndNonceSQL, [
            account.nonce,
            account.publicAddress
        ]);
    }
}

export default new AccountRepository();