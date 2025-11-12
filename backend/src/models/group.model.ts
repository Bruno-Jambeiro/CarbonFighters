/**
 * Represents the structure of the 'groups' table.
 */
export interface Group {
    id: number;
    name: string;
    owner_id: number;
    invite_code: string;
    created_at: string;
}

/**
 * Represents the structure of the 'group_members' table.
 */
export interface GroupMember {
    user_id: number;
    group_id: number;
    joined_at: string;
}