import express, { Request, Response } from "express";
import './config/prisma'
import { PORT } from "./config/env";
import cors from 'cors'
import companyRouter from './routes/companyRoutes'

const app = express();
app.use(express.json());
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World");
});


app.use('/api/company/', companyRouter)


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});