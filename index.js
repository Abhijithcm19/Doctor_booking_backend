
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan';
import patientRoute from './routes/patientRoutes/patientRouter.js';

import connectDatabase from './config/database.js';
 
dotenv.config()
const app = express()
const port = process.env.PORT || 8000
connectDatabase();
app.use(morgan('tiny'));
app.disable('x-powered-by') // less hackers know about our stack





// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.use('/', patientRoute);


app.listen(port, ()=>{
    connectDatabase();
    console.log('server listening on port' , port)
})
