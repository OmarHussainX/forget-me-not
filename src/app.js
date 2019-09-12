import express from 'express'
import exphbs from 'express-handlebars'

const app = express()
const port = 5000

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