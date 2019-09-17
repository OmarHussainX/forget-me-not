const express = require('express')
const router = express.Router()


// 'index' route
router.get('/', (req, res) => {
  res.render('index', { title: 'Welcome' })
})


// 'about' route
router.get('/about', (req, res) => {
  res.render('about')
})


module.exports = router