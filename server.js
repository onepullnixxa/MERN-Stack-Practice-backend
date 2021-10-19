// =============================
//         DEPENDENCIES
// =============================
// Get .env variables
require("dotenv").config();
// Pull PORT from .env, give default value of 4000
// Pull MONGODB_URL from .env
const { PORT = 4000, MONGODB_URL } = process.env;
// Import express
const express = require("express");
// Create application object
const app = express();
// Import mongoose
const mongoose = require("mongoose");
// Import middleware
const cors = require("cors");
const morgan = require("morgan");

// =============================
//          DATABASE
// =============================
// Establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

// =============================
//           MODELS
// =============================
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People", PeopleSchema);

// =============================
//          MIDDLEWARE
// =============================
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

// =============================
//           ROUTES
// =============================
// Create a test route
app.get("/", (req, res) => {
    res.send("hello world");
});

// People INDEX Route
app.get("/people", async (req, res) => {
    try {
        // send all people
        res.json(await People.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// People CREATE Route
app.post("/people", async (req, res) => {
    try {
        //send all people
        res.json(await People.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// People DELETE Route
app.delete("/people/:id", async (req, res) => {
    try {
        //send all people
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        //send error
        res.status(400).json(error);
    };
});

// People UPDATE Route
app.put("/people/:id", async (req, res) => {
    try {
        //send all people
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, { new: true})
        );
    } catch (error) {
        //send error
        res.status(400).json(error);
    };
});

// =============================
//          LISTENER
// =============================
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));