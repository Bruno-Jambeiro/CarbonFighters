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

export enum RequirementType {
    ACTIONS_COUNT = 'actions_count',
    STREAK_DAYS = 'streak_days',
    GROUP_JOIN = 'group_join',
    CATEGORY_COUNT = 'category_count',
    SPECIAL_EVENT = 'special_event'
}

export interface Badge {
    id: number;
    name: string;
    description: string;
    type: BadgeType;
    icon: string;
    requirement: number;
    requirement_type: RequirementType;
    category?: string;
    points: number;
    created_at: string;
}

export interface UserBadge {
    id: number;
    user_id: number;
    badge_id: number;
    earned_at: string;
}

export interface BadgeWithEarnedDate extends Badge {
    earned_at?: string;
}

export interface Notification {
    id: number;
    user_id: number;
    type: string;
    title: string;
    message: string;
    badge_id?: number;
    is_read: boolean;
    created_at: string;
}
