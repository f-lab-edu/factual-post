export interface UserInformation {
    id: number;
    userId: string;
    password?: string;
}

export interface TokenPayload {
    ok: boolean;
    id?: number;
    userId?: string;
    message?: string;
}

