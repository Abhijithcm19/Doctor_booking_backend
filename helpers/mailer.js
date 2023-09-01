import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';

dotenv.config();

let nodeConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
});

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;
    
    // body of the email
    var email = {
        body: {
            name: username,
            intro: text || 'Welcome to Medcare. We are very excited to have you on board.',
            outro: "Need help or have questions? Just reply to this email, we'd love to help."
        }
    };
    
    var emailBody = MailGenerator.generate(email);
    
    let message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    };
    
    try {
        await transporter.sendMail(message);
        return res.status(200).send({ msg: "You should receive an email from us." });
    } catch (error) {
        return res.status(500).send({ error });
    }
};
