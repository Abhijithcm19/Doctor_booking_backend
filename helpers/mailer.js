import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';

dotenv.config();

export async function sendOtpEmail(toEmail, otp) {
    try {
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service provider
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      // Create a Mailgen instance with your desired settings
      const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: 'Medcare',
          link: 'https://yourapp.com',
          // Add any other product-related information here
        },
      });
  
      // Generate the email body using Mailgen
    // Generate the email body using Mailgen
const email = {
    body: {
        intro: `Your OTP code is: ${otp}`,
        code: otp, // Display the OTP here without curly braces
    },
};
  
      const emailBody = mailGenerator.generate(email);
  
      // Create the mailOptions for Nodemailer
      const mailOptions = {
        from: process.env.EMAIL,
        to: toEmail,
        subject: 'Your OTP Code',
        html: emailBody,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      console.log('OTP email sent successfully');
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }
  }
  

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

