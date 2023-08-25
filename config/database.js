//database connection
import mongoose from "mongoose";
mongoose.set('strictQuery', false)
const connectDatabase = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        console.log('MongoDB database connected')
        
    } catch (err) {
        console.log('MongoDB database connection failed')

    }
}


export default  connectDatabase;