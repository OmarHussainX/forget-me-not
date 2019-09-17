import { Router } from 'express'
const router = Router()

// user login
router.get('/login', (req, res) => {
  res.render('users/login')
})

// user registration
router.get('/register', (req, res) => {
  res.render('users/register')
})

export default router
