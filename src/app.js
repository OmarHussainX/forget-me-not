const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
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
// Use express-handlebars middleware
// using the package's engine factory function, using the default
// of 'main' for the name of the default template
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')


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
          res.redirect('/notes')
        })
    })
})


app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})