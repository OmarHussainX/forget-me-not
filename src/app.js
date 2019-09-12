import express from 'express'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'

const app = express()
const port = 5000


// Use mongoose to establish DB connection,
// logging any connection errors
mongoose.connect('mongodb://localhost/forgetmenot-dev', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB connection established'))
  .catch(error => console.log(`** DB connection error **: ${error}\n`))


// To handle errors after initial connection was established,
// listen for 'error' events on the connection
const db = mongoose.connection
db.on('error', error => console.log(`DB error: ${error}\n`))

db.once('open', () => {
  // we're connected!
  console.log('DB open')
})

// express-handlebars middleware
// using the package's engine factory function, using the default
// of 'main' for the name of the default template
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')


// 'index' route
app.get('/', (req, res) => {
  // res.send('Hello World..')
  const title = 'Welcome'
  res.render('index', {
    title: title
  })
})

// 'about' route
app.get('/about', (req, res) => {
  res.render('about')
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})