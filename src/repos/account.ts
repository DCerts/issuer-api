import Repository from './base';
import { SQL } from '../utils/db';
import { Account } from '../models/account';


class AccountRepository extends Repository {
    private findByPublicAddressSQL: string;
    private findByNonceSQL: string;
    private saveWithPublicAddressAndNonceSQL: string;

    constructor() {
        super();
        this.findByPublicAddressSQL = SQL.from('select-from/accounts/by-public-address.sql').build();
        this.findByNonceSQL = SQL.from('select-from/accounts/by-nonce.sql').build();
        this.saveWithPublicAddressAndNonceSQL
            = SQL.from('insert-into/accounts/with-public-address-with-nonce.sql').build();
    }

    async findByPublicAddress(publicAddress: string) {
        const result = await this.db?.get(this.findByPublicAddressSQL, [publicAddress]);
        if (result) {
            return {
                publicAddress: result['public_address'],
                nonce: result['nonce'],
                deleted: result['deleted']
            };
        }
    }

    async findByNonce(nonce: string) {
        const result = await this.db?.get(this.findByNonceSQL, [nonce]);
        if (result) {
            return {
                publicAddress: result['public_address'],
                nonce: result['nonce'],
                deleted: result['deleted']
            };
        }
    }

    async save(account: Account) {
        await this.db?.run(this.saveWithPublicAddressAndNonceSQL, [
            account.publicAddress,
            account.nonce
        ]);
    }
}

export default new AccountRepository();