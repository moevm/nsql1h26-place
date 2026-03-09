export type Map = {
    id: string;
    user_id: string;
    title: string;
    description: string;
};

export type CreateMapPayload = {
    title: string;
    description: string;
};

export type UpdateMapPayload = Partial<CreateMapPayload>;