var jwt = require("jsonwebtoken");
var secret = "jbjasbdjaabbjdssgj91823yuber81723tgrb";

module.exports = function (req, res, next) {

    const authToken = req.headers["authorization"];

    if (authToken != undefined) {
        const bearer = authToken.split(' ');
        var token = bearer[1];

        try {
            var decoded = jwt.verify(token, secret);

            if (decoded.role == 1) {
                next();
            } else {
                res.status(401).json({msg: "Voce não tem permissão para isso!"});
                return;
            }
        } catch (err) {
            res.status(401).send({msg: "Voce não está autenticado!"});
            return;
        }

    } else {
        res.status(401).send({msg: "Voce não está autenticado!"});
        return;
    }

}