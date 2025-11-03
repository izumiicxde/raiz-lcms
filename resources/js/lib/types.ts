export type FileWithMeta = {
    file: File;
    title: string;
    section: string;
    tags: string;
    description: string;
};

interface User {
    id: string | number;
    name: string;
    email: string;
}

export interface StudyContent {
    id: string | number;
    title: string;
    description: string;
    file_path?: string;
    is_public: boolean;
    user_id: string | number;
    user?: User;
    created_at?: string;
    updated_at?: string;
}
