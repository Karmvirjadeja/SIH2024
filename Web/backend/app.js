import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dynamicRoute from "./routes/dynamic_data.js";
import locatioRoute from "./routes/savelocation.js";
import vesselRoute from "./routes/vesselRoute.js"


const app = express();

app.use(cors())

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/api',dynamicRoute)
app.use('/api/v1',locatioRoute)
app.use('/api/v1/vessel',vesselRoute)





// http://localhost:8000/api/v1/users/register

export { app }