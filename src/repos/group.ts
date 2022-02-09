import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { Group } from '../models/group';
import { AVAILABLE } from '../commons/setting';
import { Sqlite } from '../utils/sqlite';


class GroupRepository extends Repository<Group> {
    constructor() {
        super();
        this.loadQueries();
    }

    protected override convertToEntity(result: any): Group | null {
        if (!result) return null;
        return {
            id: result['group_id'],
            name: result['group_name'],
            threshold: result['threshold'],
            creator: result['creator_id'],
            available: (result['available'] as number) == AVAILABLE
        };
    }

    protected override async loadQueries() {
        this.addQuery(
            'findByGroupId',
            SimpleSQLBuilder.new()
                .select('groups')
                .by('id')
                .build()
        );
        this.addQuery(
            'findByGroupIdAndAvailable',
            SimpleSQLBuilder.new()
                .select('groups')
                .by('id')
                .and('available')
                .build()
        );
        this.addQuery(
            'findConfirmersByGroupId',
            SimpleSQLBuilder.new()
                .select('group-confirmers')
                .by('group-id')
                .and('confirmed', 'not-pending')
                .build()
        );
        this.addQuery(
            'findMembersByGroupId',
            SimpleSQLBuilder.new()
                .select('group-members')
                .by('group-id')
                .build()
        );
        this.addQuery(
            'findGroupsByMemberId',
            SimpleSQLBuilder.new()
                .select('group-members')
                .by('member-id')
                .and('available')
                .build()
        );
        this.addQuery(
            'create',
            SimpleSQLBuilder.new()
                .insert('groups')
                .with('id', 'name', 'threshold', 'creator')
                .build()
        );
        this.addQuery(
            'confirm',
            SimpleSQLBuilder.new()
                .insert('group-confirmers')
                .with('group-id', 'confirmer-id', 'confirmed')
                .build()
        );
        this.addQuery(
            'updateConfirmation',
            SimpleSQLBuilder.new()
                .update('group-confirmers')
                .with('pending')
                .by('group-id', 'confirmer-id')
                .build()
        );
        this.addQuery(
            'addMember',
            SimpleSQLBuilder.new()
                .insert('group-members')
                .with('group-id', 'member-id')
                .build()
        );
        this.addQuery(
            'updateAvailability',
            SimpleSQLBuilder.new()
                .update('groups')
                .with('available')
                .by('id')
                .build()
        );
        this.addQuery(
            'deleteGroup',
            SimpleSQLBuilder.new()
                .delete('groups')
                .by('id')
                .build()
        );
        this.addQuery(
            'deleteGroupConfirmers',
            SimpleSQLBuilder.new()
                .delete('group-confirmers')
                .by('group-id')
                .build()
        );
        this.addQuery(
            'deleteGroupMembers',
            SimpleSQLBuilder.new()
                .delete('group-members')
                .by('group-id')
                .build()
        );
        this.addQuery(
            'existsGroupConfirmation',
            SimpleSQLBuilder.new()
                .select('group-confirmers')
                .by('group-id', 'confirmer-id')
                .build()
        );
    }

    async existsGroupConfirmation(groupId: number, accountId: string, db?: Sqlite) {
        const query = this.getQuery('existsGroupConfirmation');
        const result = await (db || this.db)?.get(query, [groupId, accountId]);
        return result['existed'] as boolean;
    }

    async findByGroupId(groupId: number, db?: Sqlite) {
        const query = this.getQuery('findByGroupId');
        const result = await (db || this.db)?.get(query, [groupId]);
        return this.convertToEntity(result);
    }

    async findByGroupIdAndAvailable(groupId: number, db?: Sqlite) {
        const query = this.getQuery('findByGroupIdAndAvailable');
        const result = await (db || this.db)?.get(query, [groupId]);
        return this.convertToEntity(result);
    }

    async findConfirmersByGroupId(groupId: number, db?: Sqlite) {
        const query = this.getQuery('findConfirmersByGroupId');
        const result = await (db || this.db)?.all(query, [groupId]);
        return result?.map((r: any) => r['confirmer_id'] as string) as string[];
    }

    async findMembersByGroupId(groupId: number, db?: Sqlite) {
        const query = this.getQuery('findMembersByGroupId');
        const result = await (db || this.db)?.all(query, [groupId]);
        return result?.map((r: any) => r['member_id'] as string) as string[];
    }

    async findGroupsByMemberId(memberId: string, db?: Sqlite) {
        const query = this.getQuery('findGroupsByMemberId');
        const result = await (db || this.db)?.all(query, [memberId]);
        return result?.map(this.convertToEntity) as Group[];
    }

    async create(group: Group, db?: Sqlite) {
        const query = this.getQuery('create');
        await (db || this.db)?.run(query, [group.id, group.name, group.threshold, group.creator]);
    }

    async confirm(groupId: number, confirmerId: string, confirmed: number, db?: Sqlite) {
        const query = this.getQuery('confirm');
        await (db || this.db)?.run(query, [groupId, confirmerId, confirmed]);
    }

    async updateConfirmation(groupId: number, confirmerId: string, confirmation: number, db?: Sqlite) {
        const query = this.getQuery('updateConfirmation');
        await (db || this.db)?.run(query, [confirmation, groupId, confirmerId]);
    }

    async addMember(groupId: number, memberId: string, db?: Sqlite) {
        const query = this.getQuery('addMember');
        await (db || this.db)?.run(query, [groupId, memberId]);
    }

    async addMembers(groupId: number, members: string[], db?: Sqlite) {
        for (const member of members) {
            this.addMember(groupId, member); // TODO: Insert multiple members at once
        }
    }

    async updateAvailability(groupId: number, available: number, db?: Sqlite) {
        const query = this.getQuery('updateAvailability');
        await (db || this.db)?.run(query, [available, groupId]);
    }

    async deleteGroup(groupId: number, db?: Sqlite) {
        const query = this.getQuery('deleteGroup');
        await (db || this.db)?.run(query, [groupId]);
    }

    async deleteGroupConfirmers(groupId: number, db?: Sqlite) {
        const query = this.getQuery('deleteGroupConfirmers');
        await (db || this.db)?.run(query, [groupId]);
    }

    async deleteGroupMembers(groupId: number, db?: Sqlite) {
        const query = this.getQuery('deleteGroupMembers');
        await (db || this.db)?.run(query, [groupId]);
    }
}

export default new GroupRepository();