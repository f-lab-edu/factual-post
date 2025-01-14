import dataSource from '../../Database/typeormDatabase';
import User from '../Entity/User';
import Users from '../../Database/Entities/Users';

export const createUser = async (user: User): Promise<void> => {
    const queryRunner = dataSource.createQueryRunner();

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const { userId } = user;
        const existUser = await isExist(userId);

        if (existUser) {
            throw new Error(`중복된 아이디입니다.`);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Users)
            .values(user)
            .execute();

        await queryRunner.commitTransaction();
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw new Error(`회원가입에 실패했습니다 : ${err.message}`);
    } finally {
        await queryRunner.release();
    }
};

export const loginVerification = async (userId: string): Promise<Users> => {
    const userRepository = dataSource.getRepository(Users);
    try {
        const user = await userRepository
            .createQueryBuilder('users')
            .where('users.userId = :userId', { userId })
            .getOne();
            
        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        return user;
    } catch (err) {
        throw new Error(`User Repository login verification : ${err.message}`);
    }
};

export const findAllUser = async (page: number): Promise<Users[]> => {
    const userRepository = dataSource.getRepository(Users);
    try {
        const offset = (page - 1) * Number(process.env.PAGE_LIMIT);
        const users = await userRepository
            .createQueryBuilder('users')
            .skip(offset)
            .take(Number(process.env.PAGE_LIMIT))
            .getMany();

        return users;
    } catch (err) {
        throw new Error(`User Repository findAllUser : ${err.message}`);
    }
};

const isExist = async (userId: string): Promise<boolean> => {
    try {
        const userRepository = dataSource.getRepository(Users);
        const existUser = await userRepository
            .createQueryBuilder('users')
            .where('users.userId = :userId', { userId })
            .getOne();

        return existUser ? true : false;
    } catch (err) {
        throw new Error(`User repository isExist : ${err.message}`);
    }
};
