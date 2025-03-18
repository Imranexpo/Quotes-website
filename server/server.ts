import express, { Request, Response } from 'express';
import { router } from './routes/routes';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config({ path:"./.env"})
const app = express();
const port = process.env.PORT || 14853;
app.use(express.json());
app.use(cors())

app.use('/api', router)
// app.all('/', (req, res) => {
//     res.status(200).send('API server id active...!')
// })
// app.all("*", (req, res) => {
//     res.status(404).send('(¯\\_(ツ)_/¯) : API not found...!')
// })

app.listen(port, () => console.log(`Listening on port ${port}`))