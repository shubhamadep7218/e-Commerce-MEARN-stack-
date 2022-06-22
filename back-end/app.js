const express= require('express');
const cookieParser = require('cookie-parser')
const app = express();
const errorMiddleware = require('./middlewares/error')


app.use(express.json());
app.use(cookieParser());


const product = require('./routes/productRoute');
const user = require('./routes/userRoutes')
const order = require('./routes/orderRoutes')
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);

app.use(errorMiddleware);

module.exports = app

