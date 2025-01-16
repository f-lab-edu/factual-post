export interface ICacheMemory {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
}

export interface IAuthStrategy {
    authenticate(req: Request, res: Response): Promise<boolean>;
}