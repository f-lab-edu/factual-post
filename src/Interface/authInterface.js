class AuthStrategy {
    constructor(strategy) {
        this.strategy = strategy;
    }

    fullfilled = async (req, res, next) => {
        try{
            const isAuthenticated = await this.strategy.authenticate(req, res);
            if(!isAuthenticated) {
                return res.status(401).send({ message:});
            }
            
            return next();
        } catch(err) {
            return res.status(401).send(err.message);
        }
    };
}

module.exports = AuthStrategy;