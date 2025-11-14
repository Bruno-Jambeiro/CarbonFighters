export interface Action {
    id: number;
    activity_type: string;
    activity_title: string;
    activity_description: string;
    activity_date: string;
    user_id: number;
    imagem_path: string;
    validated_by?: number | null;
}

export type CreateActionInput = {
    activity_type: string;
    activity_title: string;
    activity_description: string;
    activity_date: string;
    imagem_path: string;
};
