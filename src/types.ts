export interface UserInformation {
    id: number;
    userId: string;
    password?: string;
}

export const TYPES = {
    CacheMemory: Symbol.for('CacheMemory'),
    JWTService: Symbol.for('JWTService'),
    AuthStrategy: {
        JWT: Symbol.for('AuthStrategy'),
    },
    AuthMiddleware: Symbol.for('AuthMiddleware')
}

