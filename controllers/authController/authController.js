import UserModel from '../../models/UserSchema.js'
import DoctorModel from '../../models/DoctorSchema.js';
import Auth from'../../middleware/auth.js'
import { sendOtpEmail, registerMail } from '../../helpers/mailer.js';
import bcrypt from'bcrypt'
import jwt  from 'jsonwebtoken';
import otpGenerator from'otp-generator'
import dotenv from 'dotenv'
dotenv.config()