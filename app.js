require('dotenv').config()
require('express-async-errors');

// packages
const bodyparser = require('body-parser');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const connectDB = require('./db/db.connect');
const authentication = require('./middlewares/auth.middleware');

// routes

const userRoutes = require('./routes/user.routes');





// Middlewares routes
const notFoundMiddleware = require('./middlewares/not-found.middleware');
const errorHandlerMiddleware = require('./middlewares/error-handler.middleware');


// Initialize app
const app = express();


// middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
// Welcome Message 
// router.get('/', {message: "Welcome to Swabhimaan"})
// routes
app.use('/api/v1/users', userRoutes);

// middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// start server 
const start = async () => {
    try {
        // connect to database
        await connectDB(process.env.MONGO_URI);
        // start server
        app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

    }catch (error) {
        console.log(error);
    }
}

start();
