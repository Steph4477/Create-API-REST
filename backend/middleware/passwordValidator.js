const passwordSchema = require("../models/Password");

//check if password is validate
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        const errorMessage = "Le mot de passe doit comprendre entre 8 et 20 caractères, 1 majuscule et 2 chiffres."
        // Write the header of the request with error status 400 and the message for the user.
        res.writeHead(400, errorMessage)
        res.end()
    } 
    else {
        next()
    }
}

