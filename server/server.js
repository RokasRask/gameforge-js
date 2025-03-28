import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, '../public')));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gameforge'
});

con.connect(err => {
    if (err) throw err;
    console.log('Connected to database!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});