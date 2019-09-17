import { Router } from 'express'
const router = Router()


// 'index' route
router.get('/', (req, res) => {
  res.render('index', { title: 'Welcome' })
})


// 'about' route
router.get('/about', (req, res) => {
  res.render('about')
})


export default router