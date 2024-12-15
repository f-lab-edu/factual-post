const userService = require('../service/userService');

exports.getUser = async (req, res) => {
    try{
        const user = await userService.getAllUsers();
        res.send(user);
    } catch(err){
        console.error("getUser occured Error : ", err);
        res.status(500).send("Server Error");
    }
}