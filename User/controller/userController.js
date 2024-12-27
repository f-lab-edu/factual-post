const userApplicationService = require('../service/userApplicationService');
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;
// 회원가입
module.exports.signUp = async (req, res) => {
    try{
        const {username, password} = req.body;
        await userApplicationService.signUp(username, password);
        res.status(201).send({ message: '회원가입 완료' }); 
    } catch(err) {
        res.status(500).send({ error: err.message }); 
    }
}

// 로그인
module.exports.login = async (req, res) => {
    try{
        const { username, password } = req.body;
        const { accessToken, refreshToken } = await userApplicationService.login(username, password);
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // JavaScript에서 접근 불가
            secure: false, // 개발용
            sameSite: 'Strict', // CSRF 방어용 (Strict 또는 Lax 설정 권장)
            maxAge: REFRESH_TOKEN_EXPIRES
        })
        res.status(200).send({ message: '로그인 완료'});
    } catch(err) {
        res.status(401).send({ error: err.message });
    }
}

module.exports.findAllUser = async (req, res) => {

    try{
        const users = await userApplicationService.findAllUser();
        res.status(200).send({
            data : users,
            message: '모든 유저를 찾았습니다.'
        })
    } catch (err) {
        res.status(404).send({
            message: '모든 유저를 찾지 못했습니다.'
        })
    }

}