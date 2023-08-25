
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan';
import patientRoute from './routes/patientRoutes/patientRouter.js';
// import adminRoute from './routes/adminRoutes/adminRouter.js'
// import doctorRoute from'./routes/doctorRoutes/doctorRouter.js'
import connectDatabase from './config/database.js';
 
dotenv.config()
const app = express()
const port = process.env.PORT || 8000
connectDatabase();
app.use(morgan('tiny'));





// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// app.use("/admin", adminRoute);
// app.use('doctor', doctorRoute)
app.use('/', patientRoute);


app.listen(port, ()=>{
    connectDatabase();
    console.log('server listening on port' , port)
})
