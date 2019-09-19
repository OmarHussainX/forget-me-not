import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import handlebars from 'express-handlebars'
import methodOverride from 'method-override'
import session from 'express-session'
import flash from 'connect-flash'
import { connect, connection } from 'mongoose'

const app = express()
const port = 5000


// ------------------------------------------------------------
// Use mongoose to establish DB connection,
// logging any connection errors
connect('mongodb://localhost/forgetmenot-dev', {
  useCreateIndex: true,   //Fix "DeprecationWarning: collection.ensureIndex..."
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB connection established'))
  .catch(error => console.log(`** DB connection error **: ${error}\n`))

// To handle errors after initial connection was established,
// listen for 'error' events on the connection
const db = connection
db.on('error', error => console.log(`DB error: ${error}\n`))

db.once('open', () => {
  // we're connected!
  console.log('DB open')
})


// ------------------------------------------------------------
// Set express' view engine, specifying:
// - file extension
// - directory where layout templates reside
// - directory where partial templates reside
// - name of default layout templates
// https://github.com/ericf/express-handlebars

app.engine('hbs', handlebars({
  extname: 'hbs',
  layoutsDir: __dirname + '/../views/layouts/',
  partialsDir: __dirname + '/../views/partials/',
  defaultLayout: 'main'
}))
app.set('view engine', 'hbs')


// ------------------------------------------------------------
// Use express-session middleware
// NOTE: Using default in-memory store: a new MemoryStore instance
// The default server-side session storage, MemoryStore, is purposely not designed for a production environment. It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing.
// https://github.com/expressjs/session#store
// https://stackoverflow.com/a/40396102/11245656
app.use(session({
  'secret': '343ji43j4n3jn4jk3n',
  resave: false,
  saveUninitialized: false
}))


// ------------------------------------------------------------
// Use connect-flash middleware
// The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered
app.use(flash())


// ------------------------------------------------------------
// Create global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})


// ------------------------------------------------------------
// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// ------------------------------------------------------------
// Set static folder
app.use(express.static(path.join(__dirname, '../public')))


// ------------------------------------------------------------
// Use method-override middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


// ------------------------------------------------------------
// Define routes
app.use('/', require('./routes/index').default)
app.use('/notes', require('./routes/notes').default)
app.use('/users', require('./routes/users').default)


// ------------------------------------------------------------
// Start HTTP server
// NOTE: slightly different syntax is needed for HTTPS servers...
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})


// https://medium.com/dailyjs/how-to-prevent-your-node-js-process-from-crashing-5d40247b8ab2
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
})