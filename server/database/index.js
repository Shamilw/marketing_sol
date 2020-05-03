const mongoose = require("mongoose")
const User = require("./User")


const db_url=process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/marketings'

mongoose.connect(db_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

mongoose.connection.once("connected", () => console.log("connected to mongoDB"))
mongoose.connection.once("disconnected", () => console.log("disconnected from mongoDB"))

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        console.log("mongoose disconnected from mongodb through app termination")
        process.exit(0)
    })
})

mongoose.model("User", User)
module.exports = mongoose.connection
