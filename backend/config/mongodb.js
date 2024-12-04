import mongoose from "mongoose";

const connectDB = async () =>{
    // try {
    //     await mongoose.connect(process.env.MONGODB_URI, {
    //           });
    //     console.log("Database Connected");
    // } catch (error) {
    //     console.error("Error connecting to database", error);
    //  }
     mongoose.connection.on('connected', () => console.log("Database Connected"))

     await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
};

export default connectDB;