import express from 'express'

const app = express()
const port = 5000

// 'root' route
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})