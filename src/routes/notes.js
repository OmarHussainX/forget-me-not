const express = require('express')
const router = express.Router()
const Note = require('../models/Note')


// Notes index page - lists all notes
router.get('/', (req, res) => {
  Note.find({})
    .sort({ date: 'ascending' })
    .then(notes => {
      res.render('notes/index', { notes: notes })
    })
})


// Adds a new note to the database (processes
// submission of 'Add note' form at '/notes/add')
router.post('/', (req, res) => {

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
router.get('/add', (req, res) => {
  res.render('notes/add')
})


// 'Edit note' page (displays a form which, when submitted,
// PUTs data to '/notes/:id' using method-override)
router.get('/edit/:id', (req, res) => {
  Note.findOne({
    _id: req.params.id
  })
    .then(note => {
      res.render('notes/edit', { note: note })
    })
})


// Process data from 'Edit note' form
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  Note.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Note deleted')
      res.redirect('/notes')
    })
})


module.exports = router
