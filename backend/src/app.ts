import express from "express";
import cors from "cors";

import bodyParser from "body-parser";
import "reflect-metadata";
import dotenv from "dotenv";
import userRouter from "./routers/user.router";
import helpRouter from "./routers/help.router";
import helpRouterFulfilled from "./routers/helpFulfilled.router";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", [userRouter, helpRouter, helpRouterFulfilled]);

export default app;
