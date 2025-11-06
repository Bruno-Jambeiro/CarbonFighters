import { User } from '../models/user.model';
import { getDb } from './db.service';


export async function getAllUsers(): Promise<User[]> {
    const db = await getDb();
    const rows = await db.all<User[]>('SELECT * FROM users;');
    return rows;
}

export async function getUser(email: string): Promise<User | null> {
    const db = await getDb();
    const row = await db.get<User>('SELECT * FROM users WHERE email = ?;', [email]);

    return row || null;
};

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
    const db = await getDb();

    await db.run(
        'INSERT INTO users (firstName, lastName, email,  password) VALUES (?, ?, ?, ?);',
        [user.firstName, user.lastName, user.email, user.password]
    );

    return await getUser(user.email);
};

export async function getUserById(userId: number): Promise<User | null> {
    const db = await getDb();
    const row = await db.get<User>('SELECT * FROM users WHERE id = ?;', [userId]);
    return row || null;
}

interface DashboardData {
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    dailyStreak: number;
    ecoPoints: number;
    activeGroups: Array<{
        id: number;
        name: string;
        description: string;
        userRank?: number;
        daysLeft?: number;
        memberCount?: number;
    }>;
}

export async function getDashboardData(userId: number): Promise<DashboardData | null> {
    const user = await getUserById(userId);

    if (!user) {
        return null;
    }

    const db = await getDb();

    // Query user streak
    const streakData = await db.get<{ current_streak: number }>(
        'SELECT current_streak FROM user_streaks WHERE user_id = ?;',
        [userId]
    );
    const dailyStreak = streakData?.current_streak || 0;

    // Query user points
    const pointsData = await db.get<{ total_points: number }>(
        'SELECT total_points FROM user_points WHERE user_id = ?;',
        [userId]
    );
    const ecoPoints = pointsData?.total_points || 0;

    // Query active groups with user rank and additional info
    const activeGroups = await db.all<Array<{
        id: number;
        name: string;
        description: string;
        end_date: string | null;
        user_points: number;
        member_count: number;
    }>>(
        `SELECT 
            g.id,
            g.name,
            g.description,
            g.end_date,
            ug.points as user_points,
            (SELECT COUNT(*) FROM user_groups WHERE group_id = g.id) as member_count
        FROM groups g
        INNER JOIN user_groups ug ON g.id = ug.group_id
        WHERE ug.user_id = ? AND g.is_active = 1
        ORDER BY ug.joined_at DESC;`,
        [userId]
    );

    // For each group, calculate user's rank
    const groupsWithRank = await Promise.all(
        activeGroups.map(async (group) => {
            // Get user's rank in the group
            const rankData = await db.get<{ rank: number }>(
                `SELECT COUNT(*) + 1 as rank
                FROM user_groups
                WHERE group_id = ? AND points > (
                    SELECT points FROM user_groups WHERE user_id = ? AND group_id = ?
                );`,
                [group.id, userId, group.id]
            );

            // Calculate days left if end_date exists
            let daysLeft: number | undefined;
            if (group.end_date) {
                const endDate = new Date(group.end_date);
                const today = new Date();
                const diffTime = endDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                daysLeft = diffDays > 0 ? diffDays : undefined;
            }

            return {
                id: group.id,
                name: group.name,
                description: group.description,
                userRank: rankData?.rank,
                daysLeft,
                memberCount: group.member_count,
            };
        })
    );

    const dashboardData: DashboardData = {
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        dailyStreak,
        ecoPoints,
        activeGroups: groupsWithRank,
    };

    return dashboardData;
}
