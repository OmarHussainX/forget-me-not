const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')

const app = express()
const port = 5000


// ------------------------------------------------------------
// Use mongoose to establish DB connection,
// logging any connection errors
mongoose.connect('mongodb://localhost/forgetmenot-dev', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB connection established'))
  .catch(error => console.log(`** DB connection error **: ${error}\n`))

// Load Note Model
const Note = require('./models/Note')

// To handle errors after initial connection was established,
// listen for 'error' events on the connection
const db = mongoose.connection
db.on('error', error => console.log(`DB error: ${error}\n`))

db.once('open', () => {
  // we're connected!
  console.log('DB open')
})


// ------------------------------------------------------------
// Set express' view engine
// using the package's engine factory function, using the default
// of 'main' for the name of the default template
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')


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
// Creating global variables
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
// Use method-override middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


// ------------------------------------------------------------
// 'index' route
app.get('/', (req, res) => {
  // res.send('Hello World..')
  const title = 'Welcome'
  res.render('index', { title: title })
})

// 'about' route
app.get('/about', (req, res) => {
  res.render('about')
})

// Notes index page - lists all notes
app.get('/notes', (req, res) => {
  Note.find({})
    .sort({ date: 'ascending' })
    .then(notes => {
      res.render('notes/index', { notes: notes })
    })
})

// Adds a new note to the database (processes
// submission of 'Add note' form at '/notes/add')
app.post('/notes', (req, res) => {

  const { title, details } = req.body

  const errors = []
  if (!title) errors.push({ text: 'A title is required' })
  if (!details) errors.push({ text: 'Details are required' })

  // If the title or details are missing, display error prompts
  // on the 'Add note' form...
  if (errors.length) {
    res.render('notes/add', {
      errors: errors,
      title: title,
      details: details
    })

    // ...otherwise, save the note to the DB and display all notes
  } else {
    const newUser = {
      title: title,
      details: details
    }
    new Note(newUser)
      .save()
      .then(note => {
        req.flash('success_msg', 'Note saved')
        res.redirect('/notes')
      })
  }
})

// 'Add note' form (displays a form which, when submitted,
// POSTs data to '/notes')
app.get('/notes/add', (req, res) => {
  res.render('notes/add')
})

// 'Edit note' page (displays a form which, when submitted,
// PUTs data to '/notes/:id' using method-override)
app.get('/notes/edit/:id', (req, res) => {
  Note.findOne({
    _id: req.params.id
  })
    .then(note => {
      res.render('notes/edit', { note: note })
    })
})

// Process data from 'Edit note' form
app.put('/notes/:id', (req, res) => {
  // Find the note to be updated...
  Note.findOne({
    _id: req.params.id
  })
    // ...and update it, then save it to the database
    .then(note => {
      note.title = req.body.title
      note.details = req.body.details

      note.save()
        .then(note => {
          req.flash('success_msg', 'Note updated')
          res.redirect('/notes')
        })
    })
})


// Delete note
app.delete('/notes/:id', (req, res) => {
  Note.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Note deleted')
      res.redirect('/notes')
    })
})


app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})