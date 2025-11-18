import { dbAll, dbGet, dbRun } from './db.service';
import { Action, CreateActionInput } from '../models/actions.model';

class ActionsService {
    public async create(userId: number, data: CreateActionInput): Promise<Action> {
        // Insert the action and return inserted row
        const result = await dbRun(
            `INSERT INTO activities 
            (activity_type, activity_title, activity_description, activity_date, user_id, imagem_path) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [data.activity_type, data.activity_title, data.activity_description, data.activity_date, userId, data.imagem_path]
        );

        const id = result.lastID;
        if (!id) throw new Error('Failed to create action');

        const created = await dbGet<Action>('SELECT * FROM activities WHERE id = ?', [id]);
        if (!created) throw new Error('Action not found after insert');
        return created;
    }

    public async listByUser(userId: number): Promise<Action[]> {
        return dbAll<Action>('SELECT * FROM activities WHERE user_id = ? ORDER BY id DESC', [userId]);
    }

    /**
     * Lists all actions performed by members of a given group.
     * Returns activities joined with user basic info (firstName, lastName).
     */
    public async listByGroup(groupId: number): Promise<any[]> {
        return dbAll<any>(
            `SELECT a.*, u.firstName, u.lastName 
             FROM activities a
             INNER JOIN group_members gm ON gm.user_id = a.user_id
             INNER JOIN users u ON u.id = a.user_id
             WHERE gm.group_id = ?
             ORDER BY datetime(a.activity_date) DESC`,
            [groupId]
        );
    }
}

export const actionsService = new ActionsService();

