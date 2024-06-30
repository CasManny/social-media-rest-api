import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL, { dbName: "social-media-restapi", bufferCommands: false})
        console.log(`Database is connected on host ${connection.connection.host}`)
        
    } catch (error) {
        console.log("Error in conectToDB: ", error.message)
    }
}