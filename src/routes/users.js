import { Router } from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import User from '../models/User'
import { ensureAuthenticated } from '../helpers/auth'

const router = Router()
const saltRounds = 10   // for bcrypt


// display user login template
router.get('/login', (req, res) => {
  res.render('users/login')
})


// handle user logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})


// Handle user login form POST
router.post('/login', (req, res, next) => {
  /* 
  Authenticate login requests using passport's 'local' strategy:
  - on successful login redirect to list of notes
  - on failed login redirect to login form
  - enable the display of flash messages when redirecting (Setting the
    failureFlash option to true instructs Passport to flash an error message using the message given by the strategy's verify callback, if any. This is often the best approach, because the verify callback can make the most accurate determination of why authentication failed.)
  - display a flash message when authentication succeeds
  */

  passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/login',
    failureFlash: true,
    successFlash: 'Welcome to forget-me-not!'
  })(req, res, next)  // immediately execute passport.authenticate()?
})


// display user registration form template
router.get('/register', (req, res) => {
  res.render('users/register')
})


// Handle user registration form POST
// --> See Promise / .then().catch() version of this code below
router.post('/register', async (req, res) => {

  const { name, email, password, password2 } = req.body
  const errors = []

  if (!name) errors.push({ text: 'Name is required' })
  if (!email) errors.push({ text: 'email is required' })
  if (!password) errors.push({ text: 'Password cannot be empty' })
  if (!password2) errors.push({ text: 'Password confirmation cannot be empty' })
  if (password !== password2) errors.push({ text: 'Passwords must match' })

  // If there are errors in the user registration form, render the form
  // again, with error prompts...
  if (errors.length) {
    res.render('users/register', {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2
    })

  } else {
    // ...otherwise check if the email has already been used to register:
    //   - if the email has been used...:
    //      * prepare a flash error message regarding the issue
    //      * redirect to the registration form
    //   - ...otherwise:
    //      * hash the user's password
    //      * save the user to the DB
    // 
    // REMEMBER: MongoDB find/save operations are asynchronous...

    let registeredUser = null
    let hashedPassword = null

    try {
      registeredUser = await User.findOne({ email: email })
    } catch (err) {
      console.log(`Error searching for user with email '${email}': ${err.message}`)
    }

    if (registeredUser) {
      req.flash('error_msg', `'${email}' has already been registered`)
      res.redirect('/users/register')

    } else {

      try {
        hashedPassword = await bcrypt.hash(password, saltRounds)
      } catch (err) {
        console.log(`Password hashing error: ${err.message}`)
      }

      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword
      })

      try {
        await newUser.save()
        req.flash('success_msg', 'Registration successful, you can now log in')
        res.redirect('/users/login')
      } catch (err) {
        console.log(`Error saving user: ${err.message}`)
      }
    }
  }
})


// ===========================================================================
// Handle user registration form POST
// Promise / .then().catch() based code for processing user registration form
// --> See async/await version of this code above
router.post('/register_callback_hell', (req, res) => {

  const { name, email, password, password2 } = req.body
  const errors = []

  if (!name) errors.push({ text: 'Name is required' })
  if (!email) errors.push({ text: 'email is required' })
  if (!password) errors.push({ text: 'Password cannot be empty' })
  if (!password2) errors.push({ text: 'Password confirmation cannot be empty' })
  if (password !== password2) errors.push({ text: 'Passwords must match' })

  // If there are errors in the user registration form, render the form
  // again, with error prompts
  if (errors.length) {
    res.render('users/register', {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2
    })

  } else {
    // ...otherwise check if the email has already been used to register:
    //   - if the email has been used:
    //      * prepare a flash error message regarding the issue
    //      * redirect to the registration form
    //   - if the email has NOT been used: 
    //      * save the user to the DB
    // 
    // REMEMBER: MongoDB find/save operations are asynchronous...

    User.findOne({ email: email })
      .then((registeredUser) => {

        if (registeredUser) {
          req.flash('error_msg', `${email}' has already been registered (by ${registeredUser.name})`)
          res.redirect('/users/register')
        }

        else {

          const newUser = new User({
            name: name,
            email: email,
            password: password
          })

          // hash user's password...
          bcrypt.hash(password, saltRounds)
            .then(hashedPassword => {

              // ... then store user in DB
              newUser.password = hashedPassword
              newUser.save()

                // ... then redirect user to login form
                .then(user => {

                  console.log('user saved?', user)
                  req.flash('success_msg', 'Registration successful, you can now log in')
                  res.redirect('/users/login')
                })
                .catch(err => console.log(`Error saving user: ${err.message}`))
            })
            .catch(err => console.log(`Password hashing error: ${err.message}`))
        }
      })
      .catch(err => console.log(`Error searching for user: ${err.message}`))
  }
})
// ===========================================================================


export default router
