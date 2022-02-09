import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { Account, Role } from '../models/account';
import { Sqlite } from '../utils/sqlite';


class AccountRepository extends Repository<Account> {
    constructor() {
        super();
        this.loadQueries();
    }

    protected override convertToEntity(result: any): Account | null {
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

    protected override async loadQueries() {
        this.addQuery(
            'findAll',
            SQL.from('select-from/accounts/all').build()
        );
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
            'createAdmin',
            SimpleSQLBuilder.new()
                .insert('accounts')
                .with('id', 'name', 'birthday', 'email', 'role')
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

    async findAll(db?: Sqlite) {
        const query = this.getQuery('findAll');
        const result = await (db || this.db)?.all(query);
        return result?.map(this.convertToEntity) as Account[];
    }

    async findById(id: string, db?: Sqlite) {
        const query = this.getQuery('findById');
        const result = await (db || this.db)?.get(query, [id]);
        return this.convertToEntity(result);
    }

    async create(account: Account, db?: Sqlite) {
        const query = this.getQuery('create');
        await (db || this.db)?.run(query, [
            account.id, account.name, account.birthday, account.email
        ]);
    }

    async createAdmin(account: Account, db?: Sqlite) {
        const query = this.getQuery('createAdmin');
        await (db || this.db)?.run(query, [
            account.id, account.name, account.birthday, account.email, Role.SCHOOL
        ]);
    }

    async updateById(id: string, account: Account, db?: Sqlite) {
        const query = this.getQuery('updateById');
        await (db || this.db)?.run(query, [
            account.name, account.birthday, account.email, id
        ]);
    }

    async updateNonceById(id: string, nonce: string, db?: Sqlite) {
        const query = this.getQuery('updateNonceById');
        await (db || this.db)?.run(query, [nonce, id]);
    }
}

export default new AccountRepository();