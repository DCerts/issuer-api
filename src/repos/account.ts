import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { Account } from '../models/account';


class AccountRepository extends Repository {
    constructor() {
        super();
        this.loadQueries();
    }

    static convertToAccount(result: any): Account | null {
        if (!result) return null;
        return {
            id: result['account_id'],
            role: result['role_id'],
            name: result['full_name'],
            birthday: result['birthday'],
            email: result['email'],
            nonce: result['nonce']
        };
    }

    async loadQueries() {
        this.addQuery(
            this.findById.name,
            SimpleSQLBuilder.new()
                .select('accounts')
                .by('id')
                .build()
        );
        this.addQuery(
            this.create.name,
            SimpleSQLBuilder.new()
                .insert('accounts')
                .with('id', 'name', 'birthday', 'email')
                .build()
        );
        this.addQuery(
            this.updateById.name,
            SimpleSQLBuilder.new()
                .update('accounts')
                .with('name', 'birthday', 'email').by('id')
                .build()
        );
        this.addQuery(
            this.updateNonceById.name,
            SimpleSQLBuilder.new()
                .update('accounts')
                .with('nonce').by('id')
                .build()
        );
    }

    async findById(id: string) {
        const query = this.getQuery(this.findById.name);
        const result = await this.db?.get(query, [id]);
        return AccountRepository.convertToAccount(result);
    }

    async create(account: Account) {
        const query = this.getQuery(this.create.name);
        await this.db?.run(query, [
            account.id, account.name, account.birthday, account.email
        ]);
    }

    async updateById(id: string, account: Account) {
        const query = this.getQuery(this.updateById.name);
        await this.db?.run(query, [
            account.name, account.birthday, account.email, id
        ]);
    }

    async updateNonceById(id: string, nonce: string) {
        const query = this.getQuery(this.updateNonceById.name);
        await this.db?.run(query, [nonce, id]);
    }
}

export default new AccountRepository();