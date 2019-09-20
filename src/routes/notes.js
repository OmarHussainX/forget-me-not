import { Router } from 'express'
const router = Router()
import Note from '../models/Note'

/* 
// Notes index page - lists all notes
// See async/await version of this code below
router.get('/', (req, res) => {
  Note.find({})
    .sort({ date: 'ascending' })
    .then(notes => {
      res.render('notes/index', { notes: notes })
    })
})
 */

// Notes index page - lists all notes
router.get('/', async (req, res) => {
  console.log(`--- req.user: ${req.user}`)
  if (req.user) console.log(`--- req.user.id: ${req.user.id}`)
  const notes = await Note.find({}).sort({ date: 'ascending' })
  res.render('notes/index', { notes: notes })
})


// Investigating mongoose' Model.find()
// https://thecodebarbarian.com/how-find-works-in-mongoose
// http://thecodebarbarian.com/using-async-await-with-mocha-express-and-mongoose
router.get('/log', async (req, res) => {
  const notes = await Note.find({}).sort({ date: 'ascending' })
  console.log('notes:', notes)
  console.log('notes type:', typeof (notes))
  console.log(`notes instanceof Promise: ${notes instanceof Promise}`)

  const notesQuery = Note.find({})
  console.log('notesQuery:', notesQuery)
  console.log('notesQuery type:', typeof (notesQuery))
  console.log(`notesQuery.exec() instanceof Promise: ${notesQuery.exec() instanceof Promise}`)

  res.render('notes/index', { notes: notes })
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
    const newNote = {
      title: title,
      details: details,
      user_id: req.user.id
    }
    new Note(newNote)
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


export default router
