import express, { Request, Response } from 'express';
import AuthInterface from '../../Interface/authInterface';
import SingletonContainer from '../../Container/SingletonContainer';
import * as userController from '../controller/userController';


const userRouter = (authMiddleware: AuthInterface, container: SingletonContainer) => {
    const router = express.Router();
    router.get('/:page', authMiddleware.fullfilled, userController.findAllUser);
    router.post('/sign-up', userController.signUp);
    router.post('/login', (req: Request, res: Response) => userController.login(req, res, container));

    return router;
}

export default userRouter;
