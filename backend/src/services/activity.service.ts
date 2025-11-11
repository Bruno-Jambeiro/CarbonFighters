import { Activity } from '../models/activity.model';
import { getDb } from './db.service';


export async function loadActivity(id: number): Promise<Activity | null> {
    const db = await getDb();
    const row = await db.get<Activity>('SELECT * FROM activities WHERE id = ?;', [id]);

    return row || null;
};

export async function loadUserActivities(id: number): Promise<Activity[]> {
    const db = await getDb();
    const row = await db.all<Activity[]>('SELECT * FROM activities WHERE user_id = ?;', [id]);

    return row;
};


interface PartialActivity {
    time?: string,
    type: number,
    duration: number,
    user_id: number,
}

export async function createActivity(activity: PartialActivity): Promise<Activity | null> {
    const db = await getDb();

    const time = activity.time ?? Date.now().toString();

    const { lastID } = await db.run(
        'INSERT INTO activities (time, activity_type, activity_duration, user_id) VALUES (?, ?, ?, ?);',
        [time, activity.type, activity.duration, activity.user_id]
    );

    return await loadActivity(lastID!);
};

export async function removeActivity(id: number): Promise<void> {
    const db = await getDb();

    await db.run(
        'DELETE FROM activities WHERE id = ?;',
        [id]
    );
};
