import express, { Request, Response } from "express";
import './config/prisma'
import { PORT } from "./config/env";
import cors from 'cors'
import companyRouter from './routes/companyRoutes'
import authRouter from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

const app = express();
app.use(express.json());
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use('/api/company/', companyRouter)
app.use('/api/auth/', authRouter)
app.use('/api/user/', userRoutes)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});