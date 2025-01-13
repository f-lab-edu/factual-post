import { Request, Response, NextFunction } from 'express';

interface AuthStrategyInterface {
    authenticate(req: Request, res: Response): Promise<boolean>;
}

class AuthStrategy {
    private strategy: AuthStrategyInterface;

    constructor(strategy: AuthStrategyInterface) {
        this.strategy = strategy;
    }

    fullfilled = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const isAuthenticated = await this.strategy.authenticate(req, res);
            if (!isAuthenticated) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            return next();
        } catch (err) {
            return res.status(401).send((err as Error).message);
        }
    };
}

export default AuthStrategy;
