import express, { Request, Response } from 'express';
import AuthInterface from '../../Interface/authInterface';
import * as userController from '../controller/userController';

const userRouter = (authMiddleware: AuthInterface) => {
    const router = express.Router();
    router.get('/:page', authMiddleware.fullfilled, userController.findAllUser);
    router.post('/sign-up', userController.signUp);
    router.post('/login', (req: Request, res: Response) => userController.login(req, res));

    return router;
}

export default userRouter;
