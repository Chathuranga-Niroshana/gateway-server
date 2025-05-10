import express, { Request, Response } from "express";
import './config/prisma'
import { PORT } from "./config/env";

const app = express();
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.send("Hello World");
});
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});