import User from '../Entity/User';
import Users from '../../Database/Entities/Users';
import bcrypt from 'bcrypt';
import * as UserRepository from '../repository/userRepository';
import { UserInformation } from '../../types';
import JWTService from '../../Auth/jwt/jwt';
import { ICacheMemory } from '../../Interface/interface';

const NumberToStringUserId = (id: number) => {
    return id.toString();
};

const comparePasswordWithBcrypt = async (password : string, bcryptPassword : string):Promise<boolean> => {
    return await bcrypt.compare(password, bcryptPassword);
};

export const signUp = async (userId: string, password: string): Promise<void> => {
    try {
        const user = new User(userId, password);
        await user.encodePassword();
        await UserRepository.createUser(user);
    } catch (err) {
        throw err;
    }
};

export const login = async ( 
    userId: string,
    password: string, 
    jwtService: JWTService, 
    cachedMemory: ICacheMemory
): Promise<{ accessToken: string, refreshToken: string }> => {
    new User(userId, password);
    const userInformation = await userLoginVerification(userId, password);
    const accessToken = jwtService.sign(userInformation);
    const refreshToken = jwtService.refresh();
    cachedMemory.set(NumberToStringUserId(userInformation.id), refreshToken);
    return { accessToken, refreshToken };
};

const userLoginVerification = async (userId: string, userPassword: string): Promise<Omit<UserInformation, 'password'>> => {
    validateUsername(userId);
    const userInformation = await UserRepository.loginVerification(userId);
    if (userInformation.userId !== userId) {
        throw new Error('존재하지 않는 사용자입니다.');
    }
    const passwordCheck = await comparePasswordWithBcrypt(userPassword, userInformation.password);
    if (!passwordCheck) {
        throw new Error('비밀번호가 일치하지 않습니다.');
    }
    const { password, ...userWithoutPassword } = userInformation;

    return userWithoutPassword;
};

export const findAll = async (page: string): Promise<Users[]> => {
    return await UserRepository.findAllUser(Number(page));
};

const validateUsername = (userId : string) : void => {
    const usernameRegex = /^[a-zA-Z0-9]{2,20}$/;
    if (!usernameRegex.test(userId)) {
        throw new Error('허용되지 않은 문자가 입력되었습니다.');
    }
};