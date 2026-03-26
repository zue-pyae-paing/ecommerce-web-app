import express from 'express'
import cors from 'cors'
import helmet from "helmet";
import { errorMiddleware } from './middlewares/error.middleware.js';


import userRoutes from './routes/user.route.js'
import authRoutes from "./routes/auth.route.js"
const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/auth",authRoutes)
app.use('/api/v1/users',userRoutes)

app.use(errorMiddleware)
app.listen(3000, () => {
    console.log('Server is running on port 3000')
})