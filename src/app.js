import express from 'express'
import exphbs from 'express-handlebars'
 

const app = express()
const port = 5000
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')


// 'root' route
app.get('/', (req, res) => {
  res.send('Hello World')
})

// 'about' route
app.get('/about', (req, res) => {
  res.send('About...')
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})