import { dbRun, dbGet, dbAll } from './db.service';
import { nanoid } from 'nanoid';
import { Group, GroupMember } from '../models/group.model';
import * as badgeService from './badge.service';

class GroupService {
    // Handles business logic for Groups.
    // Abstracts database interactions.
    
    public async createGroup(name: string, ownerId: number): Promise<Group> {
        // Creates a new group and automatically adds the creator as the first member.
        // This is executed as a transaction to ensure data integrity.

        const inviteCode = nanoid(8); // Generate an 8-character random invite code
        
        try {
            // Begin transaction
            await dbRun('BEGIN TRANSACTION');

            // Create the group
            const groupStmt = await dbRun(
                'INSERT INTO groups (name, owner_id, invite_code) VALUES (?, ?, ?)',
                [name, ownerId, inviteCode]
            );
            
            const groupId = groupStmt.lastID;
            if (!groupId) {
                throw new Error('Failed to create group, ID not returned.');
            }

            // Add the owner as the first member
            await dbRun(
                'INSERT INTO group_members (user_id, group_id) VALUES (?, ?)',
                [ownerId, groupId]
            );

            // Commit the transaction
            await dbRun('COMMIT');

            // Return the newly created group to the controller
            const newGroup = await this.findGroupById(groupId);
            if (!newGroup) {
                throw new Error('Group was created but could not be found.');
            }
            return newGroup;

        } catch (error) {
            // If anything fails, undo all operations
            await dbRun('ROLLBACK');
            console.error('Error creating group (transaction rolled back):', error);
            throw new Error('Could not create group.');
        }
    }


    
    public async joinGroup(inviteCode: string, userId: number): Promise<GroupMember> {
        // Adds a user to a group using an invite code.

        // Find the group by the invite code
        const group = await this.findGroupByInviteCode(inviteCode);
        if (!group) {
            throw new Error('Invalid invite code or group not found.');
        }

        // Check if the user is already in the group
        const existingMember = await dbGet<GroupMember>(
            'SELECT * FROM group_members WHERE user_id = ? AND group_id = ?',
            [userId, group.id]
        );

        if (existingMember) {
            throw new Error('You are already a member of this group.');
        }

        // Add the user to the group
        await dbRun(
            'INSERT INTO group_members (user_id, group_id) VALUES (?, ?)',
            [userId, group.id]
        );
        
        // Return the membership details
        const newMember = await dbGet<GroupMember>(
            'SELECT * FROM group_members WHERE user_id = ? AND group_id = ?',
            [userId, group.id]
        );

        if (!newMember) {
            throw new Error('Failed to join group.');
        }

        // CA2: Verificar y otorgar badges automáticamente
        await badgeService.checkAndAwardBadges(userId);

        return newMember;
    }


    // Finds a group by its ID.
    public async findGroupById(id: number): Promise<Group | null> {
        const group = await dbGet<Group>('SELECT * FROM groups WHERE id = ?', [id]);
        return group || null;
    }


    //Finds a group by its invite code.
    public async findGroupByInviteCode(code: string): Promise<Group | null> {
        const group = await dbGet<Group>('SELECT * FROM groups WHERE invite_code = ?', [code]);
        return group || null;
    }


    // Finds all groups a specific user is a member of.
    public async findGroupsByUserId(userId: number): Promise<Group[]> {
        const groups = await dbAll<Group>(
            `SELECT g.* FROM groups g
             JOIN group_members gm ON g.id = gm.group_id
             WHERE gm.user_id = ?`,
            [userId]
        );
        return groups;
    }
}

// Export a single instance (Singleton pattern) of the service
export const groupService = new GroupService();