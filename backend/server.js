// // Import dependencies
// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
// const authRoutes = require('./routes/authRoutes');
// const { requireAuth, checkUser } = require('./middleware/authMiddleware');
// const path = require('path');

// // Initialize environment variables
// dotenv.config();

// // Create Express app
// const app = express();
// const PORT = process.env.PORT;

// // Middleware
// app.use(express.static('public')); // Serve static files
// app.use(express.json());           // Parse JSON bodies
// app.use(cookieParser());           // Parse cookies

// // Set up EJS view engine and view directory
// app.set('view engine', 'ejs');

// // MongoDB connection
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// mongoose.connect(process.env.MONGO_URI, clientOptions)
//     .then(() => console.log("Successfully connected to MongoDB"))
//     .catch(error => console.error("MongoDB connection error:", error));

// // Routes
// app.get('*', checkUser); // Run checkUser middleware on all routes to check user authentication status
// //app.get('/', requireAuth, (req, res) => res.render('home')); // Protected home route
// //app.get('/home', requireAuth, (req, res) => res.render('home'));
// app.use(authRoutes);

// // Start the server
// app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
//const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')
const cors = require('cors');

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
// routes
app.use('/user', userRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })

// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// mongoose.connect(process.env.MONGO_URI, clientOptions)
//     .then(() => console.log("Successfully connected to MongoDB"))
//     .catch(error => console.error("MongoDB connection error:", error));
