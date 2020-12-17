require('./models/User')
const express = require('express')
const mongoose = require('mongoose')
//mongoose allows our express api to speak with MongoDb
const bodyParser = require('body-parser')
//bodyparser is a helper library that automatically parse information associated with the body of the incoming request
const authRoutes = require('./routes/authRoutes')

const requireAuth = require('./middlewares/requireAuth')
//this allows us to use the middleware authentication in and of our handlers

const app = express()

app.use(bodyParser.json())
//this parses the json data from the incoming request and places it in the req object of the post request

app.use(authRoutes)
//associates all the request handlers added to the router with the main express application

const mongoUri = 'mongodb+srv://admin:passwordpassword@cluster0.hxanb.mongodb.net/tracker-server?retryWrites=true&w=majority'
//this is the uri provided by Mongodb - Note that the passwordpassword above was entered in manually as the password that I created when initializing a user for the database on mongoDB

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
//2 arg object just helps to prevent error messages on our local server

mongoose.connection.on('connected', () => {
    console.log('Successfully connected to mongo instance')
})
//anytime we successfully connect to our mongo instance, the callback function (2nd arg) will run 

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err)
})
//if there is an error connecting to mongo, this will run and fire the callback function

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`)
})
//anytime someone makes a get request to the app, the function (second argument) with run with req being the required object and the res being the response
//the requireAuth means that whenever a user makes a request to the default route (root), we are going to require that the user provides a valid token, if they don't, they will get an error message


app.listen(3002, () => {
    console.log('Listening on port 3002')
})