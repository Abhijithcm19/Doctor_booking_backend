import jwt from 'jsonwebtoken';
import bcrypt from'bcrypt'

import dotenv from 'dotenv'
dotenv.config()














  export async function adminLogin(req, res) {
    const { email, password } = req.body;
  
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
  
      console.log('Received email:', email);
      console.log('Received password:', password);
      
      // Rest of your code...
      if (email === adminEmail && password === adminPassword) {
        // Create a JWT token for the admin
        const token = jwt.sign(
          {
            email: adminEmail,
            isAdmin: true,
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
  
        return res.status(200).send({
          msg: 'Admin Login Successful',
          email: adminEmail,
          token,
        });
      } else {
        return res.status(401).send({ error: 'Unauthorized' });
      }
    } catch (error) {
      return res.status(500).send({ error: 'Internal server error' });
    }
  }
  