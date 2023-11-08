import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Routes from './routes/route.js';
import Connection from './database/db.js';
const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  next();
});
app.use(cors());
dotenv.config();
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', Routes);
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is successfully running on PORT number ${PORT}`);
});
