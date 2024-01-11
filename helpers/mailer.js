import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';

dotenv.config();

export async function sendOtpEmail(toEmail, otp) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: 'mediMate',
          link: 'https://medimate.com',
        },
      });
  
const email = {
    body: {
        intro: `Your OTP code is: ${otp}`,
        code: otp,
    },
};
  
      const emailBody = mailGenerator.generate(email);
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: toEmail,
        subject: 'Your OTP Code',
        html: emailBody,
      };
  
      await transporter.sendMail(mailOptions);
  
      console.log('OTP email sent successfully',otp);
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }
  }
  

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;
    
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

