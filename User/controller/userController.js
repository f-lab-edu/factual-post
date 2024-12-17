const userApplicationService = require('../Service/userApplicationService');

exports.signUp = async (req, res) => {
    try{
        const {username, password} = req.body;
        await userApplicationService.signUp(username, password);
        res.status(201).send({ message: '회원가입 완료' }); 
    } catch(err) {
        res.status(500).send({ error: err.message }); 
    }
}