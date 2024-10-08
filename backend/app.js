import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors({
	origin: process.env.CORS_ORIGIN || "*",
	credentials: true,
}))
// Configure middleware for each request
app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get('/api', (_, res)=>{
	res.send("/API route working");
})
import userRouter from "./routes/user.route.js"
import projectRouter from "./routes/project.route.js"
app.use("/user", userRouter)
app.use("/project", projectRouter)
export {app};

