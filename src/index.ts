import express, { NextFunction, Request, Response } from "express";
import './config/prisma'
import cors from 'cors'
import morgan from "morgan";
import helmet from "helmet";
import companyRouter from './routes/companyRoutes'
import authRouter from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import { PORT } from "./config/env";

const app = express();
app.use(express.json());
app.use(cors())
app.use(helmet());
app.use(morgan("dev"));

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use('/api/company/', companyRouter)
app.use('/api/auth/', authRouter)
app.use('/api/user/', userRoutes)

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route Not Found" });
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

process.on("SIGINT", () => {
    console.log("Server shutting down...");
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});