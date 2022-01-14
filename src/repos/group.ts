import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { Group } from '../models/group';


class GroupRepository extends Repository<Group> {
    constructor() {
        super();
        this.loadQueries();
    }

    override convertToEntity(result: any): Group | null {
        if (!result) return null;
        return {
            id: result['group_id'],
            name: result['group_name'],
            threshold: result['threshold'],
            available: result['available']
        };
    }

    override async loadQueries() {
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
            'create',
            SimpleSQLBuilder.new()
                .insert('groups')
                .with('id', 'name', 'threshold')
                .build()
        );
        this.addQuery(
            'confirm',
            SimpleSQLBuilder.new()
                .insert('group-confirmers')
                .with('group-id', 'confirmer-id')
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
    }

    async findByGroupId(groupId: number) {
        const query = this.getQuery('findByGroupId');
        const result = await this.db?.get(query, [groupId]);
        return this.convertToEntity(result);
    }

    async findByGroupIdAndAvailable(groupId: number) {
        const query = this.getQuery('findByGroupIdAndAvailable');
        const result = await this.db?.get(query, [groupId]);
        return this.convertToEntity(result);
    }

    async findConfirmersByGroupId(groupId: number) {
        const query = this.getQuery('findConfirmersByGroupId');
        const result = await this.db?.all(query, [groupId]);
        return result?.map(r => r['confirmer_id'] as string);
    }

    async findMembersByGroupId(groupId: number) {
        const query = this.getQuery('findMembersByGroupId');
        const result = await this.db?.all(query, [groupId]);
        return result?.map(r => r['member_id'] as string);
    }

    async create(group: Group) {
        const query = this.getQuery('create');
        await this.db?.run(query, [group.id, group.name, group.threshold]);
    }

    async confirm(groupId: number, confirmerId: string) {
        const query = this.getQuery('confirm');
        await this.db?.run(query, [groupId, confirmerId]);
    }

    async addMember(groupId: number, memberId: string) {
        const query = this.getQuery('addMember');
        await this.db?.run(query, [groupId, memberId]);
    }

    async addMembers(groupId: number, ...members: string[]) {
        for (const member of members) {
            this.addMember(groupId, member); // TODO: Insert multiple members at once
        }
    }

    async updateAvailability(groupId: number, available: boolean) {
        const query = this.getQuery('updateAvailability');
        await this.db?.run(query, [available, groupId]);
    }
}

export default new GroupRepository();