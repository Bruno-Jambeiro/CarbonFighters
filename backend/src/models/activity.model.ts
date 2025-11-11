export interface Activity {
    id: number;
    time: string;
    type: number;
    duration: number;
    user_id: number;
    validated_by?: number;
}