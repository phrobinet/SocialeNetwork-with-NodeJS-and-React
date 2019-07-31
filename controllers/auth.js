const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const User = require("../models/user");
const _ = require("lodash");
const { sendEmail } = require("../helpers");




exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
        return res.status(403).json({
            error: "Le mail exite déjà!"
        });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: "Votre inscription ! Vous pouvez vous connecter." });
};

exports.signin = (req, res) => {
    // * checher l'user par rapport au mail
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: "L'utiliateur avec ce mail n'existe pas. Enregistrez-vous s'il vous plait."
            });
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "L'email et le mot de passe ne correspondent pas"
            });
        }
        // Généré un token avec user id et le JWT Secret
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        // Durée de vie du token
        res.cookie("t", token, { expire: new Date() + 9999 });
        // retourne la réponse avec l'usesr et le token au front
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "Déconnexion réussi!" });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});


exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // * Cherche l'user par rapport à son mail
    User.findOne({ email }, (err, user) => {

        if (err || !user)
            return res.status("401").json({
                error: "L'adresse mail n'existe pas!"
            });

        // * Génére un token avec un userId generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Instructions pour réinitialiser le mot de passe",
            text: `Utiliser le lien pour réinitialiser le mot de passe: ${
                process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Utiliser le lien pour réinitialiser le mot de passe: </p> <p>${
                process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent toUn mail a été envoyé ${email}. Suivez les instructions pour réinitialiser le mot de passe.`
                });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // si err ou pas d'user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Bien! Maintenant cous pouvez vous connecter avec votre nouveau mot de passe.`
            });
        });
    });
};

