
const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@node-react.com" };

exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        service: "Gmail",
        // port: 25,
        // secure: false,
        // requireTLS: true,
        auth: {
            user: "noreplynetworkphilippe@gmail.com",
            pass: "A/zerty1"
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    return transporter
        .sendMail(emailData)
        .then(info => console.log(`Message envoyé: ${info.response}`))
        .catch(err => console.log(`Problème lors de l'envoie du message: ${err}`));
};
