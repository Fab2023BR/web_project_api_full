import express from 'express';
import userRouter from './routes/users.js';
import cardRouter from './routes/cards.js';
import mongoose from 'mongoose';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js'; 
import logger from "./middlewares/logger.js";

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*"
}));

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(logger.requestLogger);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'A solicitação não foi encontrada' });
});

app.use(logger.errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Aplicativo executando na porta ${PORT}`);
});