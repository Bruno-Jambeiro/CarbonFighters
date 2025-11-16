export interface SustainableAction {
    id: number;
    user_id: number;
    action_type: ActionType;
    description: string;
    carbon_saved: number; // kg of CO2
    points: number;
    action_date: string; // YYYY-MM-DD
    created_at: string;
}

export type ActionType = 'transport' | 'recycling' | 'water' | 'energy' | 'food' | 'other';

export interface ActionStats {
    total_actions: number;
    total_carbon_saved: number;
    total_points: number;
    current_streak: number;
}
