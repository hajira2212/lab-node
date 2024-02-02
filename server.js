const path = require('path')
const express = require('express')
const connectDB = require('./utils/db')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
// const logger = require('./middleware/logger');
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')

dotenv.config({ path: './config/config.env' })
const app = express()
connectDB();

//Init Middleware
app.use(express.json({limit: '50mb'}));

app.use(cookieParser());

// app.get('/', (req, res) => res.send('Api Running'))

// app.use(logger);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File Uploading
app.use(fileupload());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/public', express.static('public'));

//Define Routes
// app.use('/api/', require('./routes/api/home'))

app.use(errorHandler);



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,
    () => console.log(`Server running ${process.env.NODE_ENV} to port ${PORT}`.yellow.bold));

//Handle unhandledRejection

process.on('unhandledRejection', (err, promise) => { 
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
})

