require('dotenv').config()
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const bodyParser = require('body-parser')
const timersRouter = require("./routes/timers");
const pumpRouter = require("./routes/pump");
const errorHandlerMiddleware = require("./utils/error-handler.js");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");
const helmet = require("helmet");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({timer: []}).write();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple Express Library API",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};

// schedule every hour to delete old timers where the endDate is greater than 24 hours, minimum amount of timers 10
setInterval(() => {
        const timers = JSON.parse(JSON.stringify(db.get("timer")));
        const now = new Date();
        const timersToDelete = timers.filter(timer => timer.endDate + 60 * 60 * 1000 < now.getTime() && timer.completed);
        for (let i = 0; i < timersToDelete.length; i++) {
            if (timers.length > 2) {
                db.get("timer").remove({id: timersToDelete[i].id}).write();
            }
        }
    },
    60 * 1000
);


const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json())
app.use(express.json());
app.use(morgan("dev"));

app.use("/pump", pumpRouter);
app.use("/pump/timers", timersRouter);
app.use(errorHandlerMiddleware);
app.listen(PORT, () => console.log(`The server is running on port http://localhost:${PORT} \n Server Ready!`));
