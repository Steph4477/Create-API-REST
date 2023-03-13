const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

exports.signup = (req, res, next) => {
    if (!emailRegex.test(req.body.email)){
        return res.status(400).json({ error: 'email invalide !' })

    }
    console.log(req.body)
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        console.log(hash)
        const user = new User({
          email: req.body.email,
          password: hash
        });
        console.log(user)
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.SECRET_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}