import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    path:{
        type: String,
        required: true
    }
})

const Route = mongoose.model("Route", routeSchema)

export default Route;