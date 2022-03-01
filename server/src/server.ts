import express from 'express';
import path from 'path';
import cors from 'cors';
import route from './route';
import logger from './logger/logger';
import dotenv from 'dotenv';



dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api/v1', route);
route.use('/upload', express.static(path.resolve(__dirname, '...','public/upload')));




app.listen(port, () => {
    logger.info(`Server is runnig on port ${port}`);
});