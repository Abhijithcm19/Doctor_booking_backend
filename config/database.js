//database connection



import mongoose from "mongoose";

const connectDatabase = async () => {
    try {
        const connectionString = process.env.MONG_URI; 

        const con = await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB Atlas connected");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        process.exit(1);
    }
};

export default connectDatabase;

// mongoose.set('strictQuery',false)
//     const connectDatabase = async () => {
//         try {
//             const con = await mongoose.connect(process.env.MONGOURL, {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//             })
//             console.log("mongo db databce conncted");
//         } catch (err) {
    
//             console.log(err);
//             process.exit(1);
    
//         }
//     }
    


// export default  connectDatabase;