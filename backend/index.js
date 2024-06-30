import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectToDatabase } from './db/connectToDB.js'
import { handleError } from './lib/handleError.js'
import authenticationRoute from './routes/auth.route.js'
dotenv.config()


const app = express()
const PORT = process.env.PORT || 8000

app.use(cookieParser()) // used to handle cookies [sending and recieving to the client]
app.use(express.json({ limit: '10mb' })) // limits the file size we recieve at the backend and recieve json objects
app.use(cors()) // eliminate any connection issues
app.use(express.urlencoded({ extended: true })) // accept form data

// routes
app.use("/api/auth", authenticationRoute)


// custom error handler
app.use(handleError)


app.listen(PORT, () => {
    console.log(`SERVER is listening on port ${PORT}`)
    connectToDatabase()
})