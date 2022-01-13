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
            'findById',
            SimpleSQLBuilder.new()
                .select('accounts')
                .by('id')
                .build()
        );
        this.addQuery(
            'create',
            SimpleSQLBuilder.new()
                .insert('accounts')
                .with('id', 'name', 'birthday', 'email')
                .build()
        );
        this.addQuery(
            'updateById',
            SimpleSQLBuilder.new()
                .update('accounts')
                .with('name', 'birthday', 'email').by('id')
                .build()
        );
        this.addQuery(
            'updateNonceById',
            SimpleSQLBuilder.new()
                .update('accounts')
                .with('nonce').by('id')
                .build()
        );
    }

    async findById(id: string) {
        const query = this.getQuery('findById');
        const result = await this.db?.get(query, [id]);
        return AccountRepository.convertToAccount(result);
    }

    async create(account: Account) {
        const query = this.getQuery('create');
        await this.db?.run(query, [
            account.id, account.name, account.birthday, account.email
        ]);
    }

    async updateById(id: string, account: Account) {
        const query = this.getQuery('updateById');
        await this.db?.run(query, [
            account.name, account.birthday, account.email, id
        ]);
    }

    async updateNonceById(id: string, nonce: string) {
        const query = this.getQuery('updateNonceById');
        await this.db?.run(query, [nonce, id]);
    }
}

export default new AccountRepository();