/**
 * Badge Model
 * Defines the structure and types for the gamification badge system
 */

export enum BadgeType {
    STREAK = 'streak',
    MILESTONE = 'milestone',
    SPECIAL = 'special',
    CATEGORY = 'category'
}

export interface Badge {
    id?: number;
    name: string;
    description: string;
    type: BadgeType;
    icon: string;
    requirement: number;  // e.g., 7 for 7-day streak, 100 for 100 actions
    points: number;
    created_at?: string;
}
